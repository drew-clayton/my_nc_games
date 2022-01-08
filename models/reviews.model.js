const db = require("../db/connection");

exports.selectReviewFromId = (id) => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, review_body, designer, review_img_url, category, reviews.created_at, reviews.votes, CAST(COUNT(comments) AS int) AS comment_count FROM reviews  LEFT JOIN comments ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows }) => rows);
};

exports.updateReviewFromId = (id, votes = 0, body) => {
  let newBody = ``;
  let params = [votes, id];
  if (body !== undefined) {
    newBody = `, review_body = $3`;
    params.push(body);
  }
  return db
    .query(
      `UPDATE reviews
      SET
      votes = votes + $1
      ${newBody} 
      WHERE review_id = $2
      RETURNING *;`,
      params
    )
    .then(({ rows }) => rows);
};

exports.selectReviews = (sort_by = `created_at`, order = `DESC`, category) => {
  if (
    ![
      `owner`,
      `title`,
      `review_id`,
      `category`,
      `review_img_url`,
      `created_at`,
      `votes`,
      `comment_count`,
    ].includes(sort_by) ||
    ![`ASC`, `DESC`].includes(order)
  ) {
    return Promise.reject({
      status: 404,
      msg: `Input query not found`,
    });
  }
  let where = ``;
  let params = [];
  if (category !== undefined) {
    where = `WHERE category = $1`;
    params.push(category);
  }
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments) AS comment_count FROM reviews  
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      ${where}
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order};`,
      params
    )
    .then(({ rows }) => rows);
};

exports.selectCommentsFromReviewId = (id) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments  
      WHERE review_id = $1`,
      [id]
    )
    .then(({ rows }) => rows);
};

exports.addCommentToReviewId = (id, obj) => {
  const { username, body } = obj;

  return db
    .query(
      `INSERT INTO comments
      (review_id, author, body)
      VALUES
      ($1, $2, $3) RETURNING *;`,
      [id, username, body]
    )
    .then(({ rows }) => rows);
};

exports.addReview = (obj) => {
  const { owner, title, review_body, designer, category } = obj;

  return db
    .query(
      `INSERT INTO reviews
      (owner, title, review_body, designer, category, votes)
      VALUES
      ($1, $2, $3, $4, $5, 0) RETURNING *;`,
      [owner, title, review_body, designer, category]
    )
    .then(({ rows }) => rows);
};

exports.deleteReview = (id) => {
  return db
    .query(
      `DELETE FROM reviews
      WHERE review_id = $1;`,
      [id]
    )
    .then();
};
