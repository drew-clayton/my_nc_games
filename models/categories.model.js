const db = require("../db/connection");
//requires in connection to the database

exports.selectCategories = () => {
  //create data manipulation for controller
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => rows);
  // querys database with SQL then returns results to controller as a promise
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
