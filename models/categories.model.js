const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => rows);
};

exports.insertCategory = (obj) => {
  const { slug, description } = obj;
  return db
    .query(
      `
      INSERT INTO categories
  (slug, description)
VALUES
  ($1, $2) RETURNING *;
  `,
      [slug, description]
    )
    .then(({ rows }) => rows);
};
