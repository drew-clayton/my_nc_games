const { removeComment } = require("../models/comments.model");

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
