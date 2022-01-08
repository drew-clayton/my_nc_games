const {
  selectCategories,
  insertCategory,
} = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  insertCategory(req.body)
    .then((category) => {
      res.status(201).send({ category: category[0] });
    })
    .catch(next);
};
