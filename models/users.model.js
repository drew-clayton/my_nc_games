const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => rows);
};

exports.selectUserFromId = (username) => {
  return db
    .query(
      `SELECT * FROM users
  WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => rows);
};
