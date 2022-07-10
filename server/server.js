const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const bcrypt = require("./bcrypt");
const cookieSession = require("cookie-session");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;

////////////////////////////////////////////////////////
////////////////////// MIDDLEWARE //////////////////////
////////////////////////////////////////////////////////

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.json());

app.use(
    cookieSession({
        secret: COOKIE_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

////////////////////////////////////////////////////////
//////////////////// GET ROUTES   //////////////////////
////////////////////////////////////////////////////////

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

////////////////////////////////////////////////////////
//////////////////// POST ROUTES   /////////////////////
////////////////////////////////////////////////////////

app.post("/register", (req, res) => {
    // console.log("req.body: ", req.body);
    bcrypt
        .hash(req.body.password)
        .then((hash) => {
            // console.log(hash);
            db.registerUser(req.body.first, req.body.last, req.body.email, hash)
                .then((result) => {
                    // console.log(result.rows[0].id);
                    req.session.userId = result.rows[0].id;
                    // console.log("userId cookie: ", req.session.userId);
                    res.json({ success: true });
                })
                .catch((err) => {
                    // console.log("err in registerUser: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("err in bcrypt register: ", err);
            res.json({ error: true });
        });
});

app.post("/login", (req, res) => {
    db.loginUser(req.body.email)
        .then((result) => {
            if (result.rows[0]) {
                // console.log(result.rows[0]);
                bcrypt
                    .compare(req.body.password, result.rows[0].password)
                    .then((isCorrect) => {
                        if (isCorrect) {
                            req.session.userId = result.rows[0].id;
                            res.json(result.rows[0]);
                        } else {
                            res.json({ error: true });
                        }
                    })
                    .catch((err) => {
                        console.log("err in bcrypt comapre: ", err);
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err in loginUser: ", err);
            res.json({ error: true });
        }); //end of catch
});

app.post("/sendCode", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.searchUser(req.body.email)
        .then((result) => {
            // console.log(result.rows[0]);
            if (result.rows[0].email) {
                db.insertResetCode(result.rows[0].email, secretCode)
                    .then((results) => {
                        ses.sendEmail(
                            result.rows[0].email,
                            `Hello. Your personal code for resetting your password is: ${secretCode}. For security reasons, you should never share this code with anyone.`,
                            "Your personal verification code."
                        )
                            .then((result) => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                // console.log("err in sendEmail: ", err);
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        // console.log("err in insertResetCode: ", err);
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            // console.log("err in searchUser: ", err);
            res.json({ error: true });
        });
});

app.post("/reset", (req, res) => {
    // console.log("req.body", req.body);
    // console.log("resetCode", req.body.resetCode);
    db.searchCode(req.body.email)
        .then((result) => {
            // console.log("result search code: ", result.rows);
            if (
                result.rows[result.rows.length - 1].code === req.body.resetCode
            ) {
                // console.log(true);
                bcrypt
                    .hash(req.body.password)
                    .then((hash) => {
                        db.updatePassword(req.body.email, hash)
                            .then((result) => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                // console.log("err in changePassword: ", err);
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        console.log("err in bcrypt updatePassword: ", err);
                        res.json({ error: true });
                    });
            } else {
                // console.log(false);
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err in searchCode: ", err);
            res.json({ error: true });
        });
});

////////////////////////////////////////////////////////
//////////////////////   LISTEN   //////////////////////
////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3001, function () {
    console.log(`I'm listening.`);
});
