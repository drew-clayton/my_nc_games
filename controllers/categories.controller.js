const { selectCategories } = require("../models/categories.models");
// requires in selectCategories from categories model

exports.getCategories = (req, res) => {
  // this function will take a request from the user and response

  selectCategories().then((categories) => {
    //invokes select function which assemebles and manipulates data and returns a promise which then use a .then to pass our data to the user
    //
    res.status(200).send({ categories });
    // this will give back a status and sent back the results from the selectCategories function in an object looking like {categories : RESULTS OBJECT}
  });
  //exports getCategories to categories router to be used when hits that route
};
