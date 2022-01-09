const {
  selectUsers,
  selectUserFromId,
  updateUserFromId,
  addUser,
} = require("../models/users.model");
const { checksIfExists } = require(`../models/utils.model`);

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserById = (req, res, next) => {
  const { username } = req.params;

  Promise.all([
    selectUserFromId(username),
    checksIfExists(`users`, `username`, username),
  ])
    .then(([user]) => {
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};

exports.patchUserById = (req, res, next) => {
  const { username } = req.params;
  const { name, avatar_url } = req.body;
  updateUserFromId(username, name, avatar_url)
    .then((user) => {
      res.status(200).send({ user: user[0] });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then((user) => {
      res.status(201).send({ user: user[0] });
    })
    .catch(next);
};
