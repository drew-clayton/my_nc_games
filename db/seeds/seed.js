const db = require("../connection");
// db = connection.js, which connects to our database, which depends on our env files.

const format = require("pg-format");
//  enables us to use PSQL and use arrays and lists with %L

const seed = (data) => {
  // data is getting passed in from run-seed.js which connects to index files for all data

  const { categoryData, commentData, reviewData, userData } = data;
  // Destructures data to have individual variables data object

  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`);
        // this drops all previous tables
        //
      })
      .then(() => {
        return db.query(`
      CREATE TABLE categories (
        slug VARCHAR PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
      );`);
        // creates a new table with name categories
        // PRIMARY KEY specific id to references which row (can be used by others to grab data from this table)
        // NOT NULL doesn't accept null as a value
        // VARCHAR limited amount of characters default is 255
        // TEXT unlimited amount of characters
        //
      })
      .then(() => {
        return db.query(`
    CREATE TABLE users (
      username VARCHAR PRIMARY KEY NOT NULL,
      avatar_url VARCHAR NOT NULL,
      name VARCHAR NOT NULL
    );`);
      })
      .then(() => {
        return db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR NOT NULL,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
      votes INT DEFAULT 0,
      category VARCHAR REFERENCES categories(slug) NOT NULL,
      owner VARCHAR REFERENCES users(username) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
        // SERIAL creates unique number after previous number when a row is added (eg 1, 2 ,3, 4, 5)
        // DEFAULT creates a default value
        // REFERENCES creates a foreign key which connects to a primary key in a other table
        // CURRENT_TIMESTAMP is a psql function that gives a current timestamp when a row is created
        //
      })
      .then(() => {
        return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR REFERENCES users(username) NOT NULL,
      review_id INT REFERENCES reviews(review_id) NOT NULL,
      votes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL
    );`);
      })
      // all tables and columns have been created
      //
      .then(() => {
        const formattedCategories = categoryData.map((obj) => {
          return [obj.slug, obj.description];
        });
        // creates a nested array of all the values of the objects without the keys preparing for %L
        //
        // console.log(formattedCategories);
        return db.query(
          format(
            `
        INSERT INTO categories(slug, description)
        VALUES %L`,
            formattedCategories
          )
        );
        // uses pg-format to add array of values assign them to different rows
        //
      })
      .then(() => {
        const formattedUsers = userData.map((obj) => {
          return [obj.username, obj.name, obj.avatar_url];
        });
        return db.query(
          format(
            `
        INSERT INTO users(username, name, avatar_url)
        VALUES %L`,
            formattedUsers
          )
        );
      })
      .then(() => {
        const formattedReviews = reviewData.map((obj) => {
          return [
            obj.title,
            obj.designer,
            obj.owner,
            obj.review_img_url,
            obj.review_body,
            obj.category,
            obj.created_at,
            obj.votes,
          ];
        });
        return db.query(
          format(
            `
        INSERT INTO reviews(title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L`,
            formattedReviews
          )
        );
      })
      .then(() => {
        const formattedComments = commentData.map((obj) => {
          return [
            obj.body,
            obj.votes,
            obj.author,
            obj.review_id,
            obj.created_at,
          ];
        });
        return db.query(
          format(
            `
        INSERT INTO comments(body, votes, author, review_id, created_at)
        VALUES %L`,
            formattedComments
          )
        );
      })
    // inserts all data into tables
    //
  );
};

module.exports = seed;
