const express = require("express");
// requires express

const { getCategories } = require("../controllers/categories.controller");
// desturctured getCategories function from categories controller to use to for GET/POST/PATCH/DELETE functions

const categoriesRouter = express.Router();
// creates a categories router which will be exported to api.router.js this is the 2nd level connection on routing

categoriesRouter.route("/").get(getCategories);
// uses router to process get request using controller function exported from categories.controller

// console.log("in categories.router.js");

module.exports = categoriesRouter;
// exports categoriesRouter to app.router.js for next level of routing
