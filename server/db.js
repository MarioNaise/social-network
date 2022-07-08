const spicedPg = require("spiced-pg");
const database = "socialNetwork";
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
