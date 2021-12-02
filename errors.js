exports.errorCustom = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
exports.errorPsql = (err, req, res, next) => {
  if (err.code == "22P02" || "23502" || "42703") {
    res.status(400).send({ msg: `Invalid input` });
  } else next(err);
};

exports.error500 = (err, req, res, next) => {
  console.log(err);
  res
    .status(500)
    .send({ msg: `internal server error the client did nothing wrong` });
};
