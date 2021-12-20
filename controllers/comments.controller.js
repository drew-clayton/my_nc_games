const {
  removeComment,
  updateCommentFromId,
} = require("../models/comments.model");

const { checksIfExists } = require(`../models/utils.model`);

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([
    checksIfExists(`comments`, `comment_id`, comment_id),
    removeComment(comment_id),
  ])
    .then(([]) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentFromId = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  Promise.all([
    updateCommentFromId(comment_id, inc_votes),
    checksIfExists(`comments`, `comment_id`, comment_id),
  ])

    .then(([comment]) => {
      res.status(200).send({ comment: comment[0] });
    })
    .catch(next);
};
