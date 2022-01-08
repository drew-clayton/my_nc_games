const db = require(`../db/connection`);

exports.removeComment = (id) => {
  return db
    .query(
      `DELETE FROM comments
      WHERE comment_id = $1;`,
      [id]
    )
    .then();
};

exports.updateCommentFromId = (id, votes = 0, body) => {
  let newBody = ``;
  let params = [votes, id];
  if (body !== undefined) {
    newBody = `, body = $3`;
    params.push(body);
  }
  return db
    .query(
      `
      UPDATE comments
      SET
      votes = votes + $1 
      ${newBody}      
      WHERE comment_id = $2
      RETURNING *;
  `,
      params
    )
    .then(({ rows }) => rows);
};
