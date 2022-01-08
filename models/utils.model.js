const db = require("../db/connection");

exports.checksIfExists = (tableName, columnName, id) => {
  return db
    .query(
      `SELECT * FROM ${tableName}
    WHERE ${columnName} = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0 && id !== undefined) {
        return Promise.reject({
          status: 404,
          msg: `input '${id}' not found in '${tableName}' database`,
        });
      }
    });
};
