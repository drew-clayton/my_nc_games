const db = require(`../db/connection`);

exports.removeComment = (id) => {
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1;
`,
      [id]
    )
    .then();
};

exports.updateCommentFromId = (id, votes) => {
  return db
    .query(
      `
      UPDATE comments
      SET
        votes = votes + $1
      WHERE comment_id = $2
      RETURNING *;
  `,
      [votes, id]
    )
    .then(({ rows }) => rows);
};
