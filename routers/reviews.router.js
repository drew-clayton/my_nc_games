const express = require("express");
const {
  getReviewFromId,
  patchReviewFromId,
  getReviews,
  getCommentsFromReviewId,
  postCommentToReviewId,
  postReview,
  removeReview,
} = require("../controllers/reviews.controller");

const reviewsRouter = express.Router();

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter
  .route("/:review_id")
  .get(getReviewFromId)
  .patch(patchReviewFromId)
  .delete(removeReview);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsFromReviewId)
  .post(postCommentToReviewId);

module.exports = reviewsRouter;
