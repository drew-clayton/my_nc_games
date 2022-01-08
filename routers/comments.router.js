const express = require("express");
const {
  deleteComment,
  patchCommentFromId,
} = require("../controllers/comments.controller");

const commentsRouter = express.Router();

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentFromId);

module.exports = commentsRouter;
