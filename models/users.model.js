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

exports.updateUserFromId = (username, name, avatar) => {
  let newName = ``;
  let newAvatar = ``;
  let comma = ``;
  let params = [username];
  if (name !== undefined) {
    newName = `name = $${params.length + 1}`;
    params.push(name);
  }
  if (avatar !== undefined) {
    newAvatar = `avatar_url = $${params.length + 1}`;
    params.push(avatar);
  }
  if (newAvatar !== `` && newName !== ``) {
    comma = `,`;
  }
  return db
    .query(
      `
      UPDATE users
      SET
      ${newName} ${comma}
      ${newAvatar} 
      WHERE username = $1
      RETURNING *;
  `,
      params
    )
    .then(({ rows }) => rows);
};

exports.addUser = (obj) => {
  const { username, name, avatar_url } = obj;
  return db
    .query(
      `INSERT INTO users
      (username, name, avatar_url)
      VALUES
      ($1, $2, $3) RETURNING *;`,
      [username, name, avatar_url]
    )
    .then(({ rows }) => rows);
};
