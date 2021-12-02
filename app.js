const express = require("express");
// express ...

const apiRouter = require("./routers/api.router");
// requires apiRouter to begin routing process

const { errorCustom, errorPsql, error500 } = require("./errors");
// requires in error handling middleware

const app = express();
// creates a variable that references express function which ...

app.use(express.json());
// makes sure to retrieve body for requests

app.use("/api", apiRouter);
// first step in the routing using the first function for the first point of route

app.all("/*", (req, res) => {
  res.status(404).send({ msg: `Path Not Found` });
});

app.use(errorCustom);
app.use(errorPsql);
app.use(error500);

module.exports = app;
// exports app to be used in tests
