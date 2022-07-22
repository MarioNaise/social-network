const express = require("express");
const app = (exports.app = express());
const server = require("http").Server(app);
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
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

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

const COOKIE_SECRET =
    process.env.COOKIE_SECRET || require("./secrets.json").COOKIE_SECRET;
const cookieSessionMiddleware = cookieSession({
    secret: COOKIE_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});
app.use(cookieSessionMiddleware);

io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            res.json({ users: result.rows, recent: true });
        })
        .catch((err) => {
            console.log("err in findNewUsers: ", err);
        });
});

app.get("/findusers/:search", (req, res) => {
    db.findUsers(req.params.search)
        .then((result) => {
            // console.log(result.rows);
            res.json({ users: result.rows, recent: false });
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

app.get("/api/friends", (req, res) => {
    db.findFriends(req.session.userId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in findFriends: ", err);
            res.json({ error: true });
        });
});

// get friends and friend requests so i dont have to do it manually all the time
app.get("/easteregg/get/famous", (req, res) => {
    if (req.session.userId === 1) {
        for (let i = 20; i < 23; i++) {
            db.getFamous(req.session.userId, i, "requests")
                .then(() => {
                    // console.log("result.rows", result.rows);
                })
                .catch((err) => {
                    console.log("err in getFamous#1", err);
                });
        }
        for (let i = 30; i < 36; i++) {
            db.getFamous(req.session.userId, i, "friends")
                .then(() => {
                    // console.log("result.rows", result.rows);
                })
                .catch((err) => {
                    console.log("err in getFamous#2", err);
                });
        }
    }
    res.redirect("/friends");
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

server.listen(process.env.PORT || 3001, function () {
    console.log(`I'm listening.`);
    // because sockets cant use an express serverm we need
    // to have the listening to be done by a node server
});

////////////////////////////////////////////////////////
//////////////////////   SOCKET   //////////////////////
////////////////////////////////////////////////////////

io.on("connection", function (socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const userId = socket.request.session.userId;
    // console.log(
    //     `user with id ${userId} and socket.id ${socket.id} just connected`
    // );

    // in here we do our emitting on every new connection! Like when the user
    // first connects we want to send them the chat history
    // 1. get the messages from the database
    db.getChatHistory()
        .then((result) => {
            // 2. send them over to the socket that just connected

            socket.emit("chatMessages", result.rows);
        })
        .catch((err) => {
            console.log("err in getChatHistory: ", err);
        });

    socket.on("new-message", (newMsg) => {
        // console.log("SERVER: received a new msg from client: ", newMsg);
        // 1. we want to know who sent the msg
        // console.log("SERVER: author of the msg was user: ", userId);
        // 2. we need to add this msg to the chat table
        db.addMessageToChat(userId, newMsg)
            .then((result) => {
                io.sockets.emit("add-new-message", result.rows);
            })
            .catch((err) => {
                console.log("err in addMessageToChat: ", err);
            });
        // 3. we want to retrieve user info about the author
        // 4. compose a msg obj that contains user info and messages
        // 5. send back to all connect sockets
    });
});
