const spicedPg = require("spiced-pg");
const database = "socialnw";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);

module.exports.registerUser = (first, last, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`;
    const param = [first, last, email, password];
    return db.query(q, param);
};

module.exports.loginUser = (email) => {
    const q = `SELECT password, id FROM users
                WHERE email = $1;`;
    const param = [email];
    return db.query(q, param);
};

module.exports.insertResetCode = (email, secretCode) => {
    const q = `INSERT INTO reset_codes (email, code)
                VALUES ($1, $2);`;
    const param = [email, secretCode];
    return db.query(q, param);
};

module.exports.findUser = (email) => {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1;`,
        [email]
    );
};

module.exports.findCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        AND email = $1
        ORDER BY id DESC
        LIMIT 1;`,
        [email]
    );
};

module.exports.updatePassword = (email, password) => {
    return db.query(
        `UPDATE users
        SET password = $2
        WHERE email = $1;`,
        [email, password]
    );
};

module.exports.getUserInfo = (userId) => {
    return db.query(
        `SELECT * FROM users
        WHERE id = $1;`,
        [userId]
    );
};

module.exports.uploadProfilePicture = (imageUrl, userId) => {
    return db.query(
        `UPDATE users
        SET profile_picture = $1
        WHERE id = $2
        RETURNING profile_picture;`,
        [imageUrl, userId]
    );
};

module.exports.updateBio = (userId, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio;`,
        [userId, bio]
    );
};

module.exports.findUsers = (val) => {
    return db.query(
        `SELECT *
        FROM users
        WHERE first ILIKE $1
        OR last ILIKE $1
        LIMIT 4;`,
        [val + "%"]
    );
};

module.exports.findNewUsers = () => {
    return db.query(
        `SELECT *
        FROM users
        ORDER BY id DESC
        LIMIT 4;`
    );
};

module.exports.friendshipStatus = (userId, viewedUserId) => {
    return db.query(
        `SELECT * FROM friendships 
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [userId, viewedUserId]
    );
};

module.exports.sendFriendRequest = (userId, viewedUserId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id)
        VALUES ($1, $2);`,
        [userId, viewedUserId]
    );
};

module.exports.acceptFriendRequest = (userId, viewedUserId) => {
    return db.query(
        `UPDATE friendships
        SET accepted = true
        WHERE (recipient_id = $1 AND sender_id = $2);`,
        [userId, viewedUserId]
    );
};

module.exports.deleteRelation = (userId, viewedUserId) => {
    return db.query(
        `DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2) 
        OR (recipient_id = $2 AND sender_id = $1);`,
        [userId, viewedUserId]
    );
};
