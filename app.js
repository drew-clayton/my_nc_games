const express = require("express");
const apiRouter = require("./routers/api.router");
const { errorCustom, errorPsql, error500 } = require("./errors");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: `Path Not Found` });
});

app.use(errorCustom);
app.use(errorPsql);
app.use(error500);

module.exports = app;
