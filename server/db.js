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

module.exports.searchUser = (email) => {
    return db.query(
        `SELECT * FROM users
        WHERE email = $1;`,
        [email]
    );
};

module.exports.searchCode = (email) => {
    return db.query(
        `SELECT * FROM reset_codes
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        AND email = $1;`,
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
