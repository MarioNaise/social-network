const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const bcrypt = require("./bcrypt");
const cookieSession = require("cookie-session");

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
                    res.json(result.rows[0]);
                })
                .catch((err) => {
                    console.log("err in registerUser: ", err);
                    res.json({ error: true });
                });
        })
        .catch((err) => {
            console.log("err in bcrypt: ", err);
        });
});

////////////////////////////////////////////////////////
//////////////////////   LISTEN   //////////////////////
////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3001, function () {
    console.log(`I'm listening.`);
});
