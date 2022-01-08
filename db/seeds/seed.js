const db = require("../connection");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`
      CREATE TABLE categories (
        slug VARCHAR(50) PRIMARY KEY NOT NULL,
        description TEXT NOT NULL
      );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users (
      username VARCHAR(50) PRIMARY KEY NOT NULL,
      avatar_url VARCHAR(255) NOT NULL,
      name VARCHAR NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR(255) NOT NULL,
      review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg' NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      category VARCHAR(50) REFERENCES categories(slug) ON DELETE CASCADE NOT NULL,
      owner VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE NOT NULL,
      review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
      votes INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      body TEXT NOT NULL
    );`);
    })
    .then(() => {
      return db.query(
        format(
          `
        INSERT INTO categories(slug, description)
        VALUES %L`,
          categoryData.map((obj) => {
            return [obj.slug, obj.description];
          })
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `
        INSERT INTO users(username, name, avatar_url)
        VALUES %L`,
          userData.map((obj) => {
            return [obj.username, obj.name, obj.avatar_url];
          })
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `
        INSERT INTO reviews(title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L`,
          reviewData.map((obj) => {
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
          })
        )
      );
    })
    .then(() => {
      return db.query(
        format(
          `
        INSERT INTO comments(body, votes, author, review_id, created_at)
        VALUES %L`,
          commentData.map((obj) => {
            return [
              obj.body,
              obj.votes,
              obj.author,
              obj.review_id,
              obj.created_at,
            ];
          })
        )
      );
    });
};

module.exports = { seed };
