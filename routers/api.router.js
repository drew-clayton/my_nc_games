const { getJSON } = require("../controllers/api.controller");

const express = require("express");
// requires express

const categoriesRouter = require("./categories.router");
// requires categoriesRouter from next router (categories.router)

const reviewsRouter = require("./reviews.router");
// requires reviewsRouter from next router (reviews.router)
const commentsRouter = require("./comments.router");

const apiRouter = express.Router();
// creates a apiRouter function which will be exported to app.js this is the first connection to routing

apiRouter.use("/categories", categoriesRouter);
// routes to using categoriesRouter function taken from categories.router

apiRouter.use("/reviews", reviewsRouter);
// routes to using reviewsRouter function taken from reviews.router

apiRouter.use("/comments", commentsRouter);

apiRouter.route("/").get(getJSON);

module.exports = apiRouter;
// exports apiRouter to app.js to start routing process
