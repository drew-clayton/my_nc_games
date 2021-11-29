const express = require("express");
// requires express

const categoriesRouter = require("./categories.router");
// requires categoriesRouter from next router (categories.router)

const apiRouter = express.Router();
// creates a apiRouter function which will be exported to app.js this is the first connection to routing

apiRouter.use("/categories", categoriesRouter);
// routes to using categoriesRouter function taken from categories.router

module.exports = apiRouter;
// exports apiRouter to app.js to start routing process
