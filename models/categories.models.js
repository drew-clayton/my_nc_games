const db = require("../db/connection");
//requires in connection to the database

exports.selectCategories = () => {
  //create data manipulation for controller
  return db.query(`SELECT * FROM categories;`).then(({ rows }) => rows);
  // querys database with SQL then returns results to controller as a promise
};
