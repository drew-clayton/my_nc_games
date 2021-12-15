const {
  selectReviewFromId,
  updateReviewFromId,
  selectReviews,
  selectCommentsFromReviewId,
  addCommentToReviewId,
} = require("../models/reviews.model");
const { checksIfExists } = require(`../models/utils.model`);

exports.getReviewFromId = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([
    selectReviewFromId(review_id),
    checksIfExists(`reviews`, `review_id`, review_id),
  ])
    .then(([review]) => {
      res.status(200).send({ review: review[0] });
    })
    .catch(next);
};

exports.patchReviewFromId = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;

  updateReviewFromId(review_id, inc_votes)
    .then((review) => {
      res.status(200).send({ review: review[0] });
    })
    .catch(next);
};
exports.getReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  Promise.all([
    selectReviews(sort_by, order, category),
    checksIfExists(`reviews`, `category`, category),
  ])
    .then(([reviews]) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsFromReviewId = (req, res, next) => {
  const { review_id } = req.params;
  Promise.all([
    selectCommentsFromReviewId(review_id),
    checksIfExists(`reviews`, `review_id`, review_id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentToReviewId = (req, res, next) => {
  const { review_id } = req.params;
  addCommentToReviewId(review_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
