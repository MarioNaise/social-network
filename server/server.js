const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const db = require("./db");
const bcrypt = require("./bcrypt");
const cookieSession = require("cookie-session");
const ses = require("./ses.js");
const cryptoRandomString = require("crypto-random-string");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");

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

app.get("/user/info", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then((result) => {
            res.json({
                profile: result.rows[0],
            });
        })
        .catch((err) => {
            console.log("err in getUserInfo: ", err);
            res.json({
                error: true,
            });
        });
});

app.get("/user/profile/:id", (req, res) => {
    if (req.params.id == req.session.userId) {
        return res.json({
            ownProfile: true,
            ownId: req.session.userId,
        });
    }
    db.getUserInfo(req.params.id)
        .then((result) => {
            if (result.rows[0]) {
                res.json({
                    profile: result.rows[0],
                });
            } else {
                console.log("no user found");
                res.json({ noUser: true });
            }
        })
        .catch((err) => {
            console.log("err in getUserInfo: ", err);
            res.json({
                error: true,
            });
        });
});

app.get("/findusers/", (req, res) => {
    db.findNewUsers()
        .then((result) => {
            // console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in findNewUsers: ", err);
        });
});

app.get("/findusers/:search", (req, res) => {
    db.findUsers(req.params.search)
        .then((result) => {
            // console.log(result.rows);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in findUsers: ", err);
        });
});

app.get("/relation/:viewedId", (req, res) => {
    db.friendshipStatus(req.session.userId, parseInt(req.params.viewedId))
        .then((result) => {
            // console.log("relation: ", result.rows[0]);
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({ noRelation: true });
            }
        })
        .catch((err) => {
            console.log("err in friendshipStatus: ", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

////////////////////////////////////////////////////////
////////////////////   POST ROUTES   ///////////////////
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
                    console.log("err in registerUser: ", err);
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
        });
});

app.post("/password/reset/code", (req, res) => {
    const secretCode = cryptoRandomString({
        length: 6,
    });
    db.findUser(req.body.email)
        .then((result) => {
            // console.log(result.rows[0]);
            if (result.rows[0].email) {
                db.insertResetCode(result.rows[0].email, secretCode)
                    .then(() => {
                        ses.sendEmail(
                            result.rows[0].email,
                            `Hello. Your personal code for resetting your password is: ${secretCode}. For security reasons, you should never share this code with anyone.`,
                            "Your personal verification code."
                        )
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("err in sendEmail: ", err);
                                res.json({ error: true });
                            });
                    })
                    .catch((err) => {
                        console.log("err in insertResetCode: ", err);
                        res.json({ error: true });
                    });
            } else {
                res.json({ error: true });
            }
        })
        .catch((err) => {
            console.log("err in searchUser: ", err);
            res.json({ error: true });
        });
});

app.post("/password/reset", (req, res) => {
    // console.log("req.body", req.body);
    // console.log("resetCode", req.body.resetCode);
    db.findCode(req.body.email)
        .then((result) => {
            // console.log("result search code: ", result.rows);
            if (result.rows[0].code === req.body.resetCode) {
                // console.log(true);
                bcrypt
                    .hash(req.body.password)
                    .then((hash) => {
                        db.updatePassword(req.body.email, hash)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("err in changePassword: ", err);
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

app.post("/friendship/:action/:viewedId", (req, res) => {
    const action = req.params.action;
    const viewedId = req.params.viewedId;
    if (action === "add") {
        // console.log("run sendFriendRequest");
        db.sendFriendRequest(req.session.userId, viewedId)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err in sendFriendRequest: ", err);
            });
    } else if (action === "remove" || action === "cancel") {
        // console.log("run deleteRelation");
        db.deleteRelation(req.session.userId, viewedId)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err in deleteRelation: ", err);
            });
    } else {
        // console.log("run acceptFriendRequest");
        db.acceptFriendRequest(req.session.userId, viewedId)
            .then(() => {
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("err in acceptFriendRequest: ", err);
            });
    }
});

/////////////////////////////////////////////////////////////////
//////////////////////   PROFILE    /////////////////////////////
/////////////////////////////////////////////////////////////////
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename(req, file, callback) {
        uidSafe(24).then((randomString) => {
            callback(null, randomString + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage,
    limits: {
        fileSize: 2097152,
    },
});

app.post(
    "/upload/profile/picture",
    uploader.single("image"),
    s3.upload,
    (req, res) => {
        // console.log("req.file in server.js: ", req.file);
        db.uploadProfilePicture(
            "https://s3.amazonaws.com/spicedling/" + req.file.filename,
            req.session.userId
        )
            .then((result) => {
                const newImage = result.rows[0];
                res.json({
                    newImage,
                });
            })
            .catch((err) => {
                console.log("err in uploadImage", err);
                res.json({ error: true });
            });
    }
);

app.post("/upload/profile/bio", (req, res) => {
    db.updateBio(req.session.userId, req.body.bio)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("err in updateBio", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

////////////////////////////////////////////////////////
//////////////////////   LISTEN   //////////////////////
////////////////////////////////////////////////////////

app.listen(process.env.PORT || 3001, function () {
    console.log(`I'm listening.`);
});
