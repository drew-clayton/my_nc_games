const express = require("express");
const {
  getUsers,
  getUserById,
  patchUserById,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.route("/").get(getUsers);
usersRouter.route("/:username").get(getUserById).patch(patchUserById);
module.exports = usersRouter;
