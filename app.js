const express = require("express");
// express ...

const apiRouter = require("./routers/api.router");
// requires apiRouter to begin routing process

const app = express();
// creates a variable that references express function which ...

app.use(express.json());
// makes sure to retrieve body for requests

app.use("/api", apiRouter);
// first step in the routing using the first function for the first point of route

module.exports = app;
// exports app to be used in tests
