const express = require("express");
const {
  getUsers,
  getUserById,
  patchUserById,
  postUser,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers).post(postUser);
usersRouter.route("/:username").get(getUserById).patch(patchUserById);
module.exports = usersRouter;
