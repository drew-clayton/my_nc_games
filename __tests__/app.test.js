const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());
describe(`API`, () => {
  it(`status 404: when their is a typo in path returns not found`, () => {
    return request(app)
      .get(`/apii/caaaatergo/something`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(`Path Not Found`);
      });
  });
  describe(`GET /api/categories`, () => {
    it(`status 200, returns an array of category objects with slug and description`, () => {
      return request(app)
        .get(`/api/categories`)
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((obj) => {
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });

  describe(`GET /api/reviews/:review_id`, () => {
    it(`status 200, a review object`, () => {
      return request(app)
        .get(`/api/reviews/1`)
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Array);
          expect(review).toHaveLength(1);
          expect(Object.entries(review[0])).toHaveLength(10);
          expect.objectContaining({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(Date),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
    });
    it(`status 400: bad request - invalid input`, () => {
      return request(app)
        .get(`/api/reviews/wrong`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 404: not found - valid input`, () => {
      return request(app)
        .get(`/api/reviews/500`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `input '500' not found in 'reviews' database`
          );
        });
    });
  });
  describe(`PATCH /api/reviews/:review_id`, () => {
    it(`status 201, takes an object with inc_votes and a number which will either increment or decrement the votes property, and will return the updated review`, () => {
      const data = { inc_votes: -10 };
      return request(app)
        .patch(`/api/reviews/1`)
        .send(data)
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toHaveLength(1);
          expect(Object.entries(review[0])).toHaveLength(9);
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            owner: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(Date),
            votes: expect(review[0].votes).toBe(-9),
          });
        });
    });
    it(`status 400: bad request - invalid value`, () => {
      const data = { inc_votes: `wrong` };
      return request(app)
        .patch(`/api/reviews/1`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 400: bad request - invalid key`, () => {
      const data = { wrong: 1 };
      return request(app)
        .patch(`/api/reviews/1`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 201: extra key-pairs are ignored`, () => {
      const data = { inc_votes: -10, wrong: "wrong", title: "wrong title" };
      return request(app)
        .patch(`/api/reviews/1`)
        .send(data)
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toHaveLength(1);
          expect(Object.entries(review[0])).toHaveLength(9);
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect(review[0].title).toBe("Agricola"),
            owner: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(Date),
            votes: expect(review[0].votes).toBe(-9),
          });
        });
    });
    it(`status 400: empty object`, () => {
      const data = {};
      return request(app)
        .patch(`/api/reviews/1`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
  });
  describe(`GET /api/reviews`, () => {
    it(`status 200, returns an array of review objects and defaults to descending and date`, () => {
      return request(app)
        .get(`/api/reviews`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          expect(reviews).toHaveLength(13);
          expect(reviews).toBeSortedBy(`created_at`, {
            descending: true,
          });
          reviews.forEach((obj) => {
            expect(Object.entries(obj)).toHaveLength(8);
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(Date),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    it(`status 200, accepts a sort_by query for any column defaults to date`, () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy(`votes`, {
            descending: true,
          });
        });
    });
    it(`status 404: incorrect sort_by input`, () => {
      return request(app)
        .get(`/api/reviews?sort_by=wrong`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(`Input query not found`);
        });
    });
    it(`status 200, accepts a order query defaults to descending`, () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes&order=ASC`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy(`votes`, { ascending: true });
        });
    });
    it(`status 404: incorrect order input`, () => {
      return request(app)
        .get(`/api/reviews?order=wrong`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(`Input query not found`);
        });
    });
    it(`status 200, accepts a category query with defaults`, () => {
      return request(app)
        .get(`/api/reviews?category=social deduction`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          expect(reviews).toBeSortedBy(`created_at`, { descending: true });
        });
    });
    it(`status 404: incorrect category input`, () => {
      return request(app)
        .get(`/api/reviews?category=wrong`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `input 'wrong' not found in 'reviews' database`
          );
        });
    });
    it(`status 200, accepts a all queries at the same time`, () => {
      return request(app)
        .get(`/api/reviews?sort_by=votes&order=ASC&category=social deduction`)
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          expect(reviews).toBeSortedBy(`votes`, { ascending: true });
        });
    });
  });

  describe(`GET /api/reviews/:review_id/comments`, () => {
    it(`status 200, an array of comments from the given Id`, () => {
      return request(app)
        .get(`/api/reviews/3/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Array);
          expect(Object.entries(comments)).toHaveLength(3);
          comments.forEach((obj) => {
            expect(Object.entries(obj)).toHaveLength(5);
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(Date),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    it(`status 400: bad request - invalid input`, () => {
      return request(app)
        .get(`/api/reviews/wrong/comments`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 404: not found - valid input but incorrect review id`, () => {
      return request(app)
        .get(`/api/reviews/500/comments`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `input '500' not found in 'reviews' database`
          );
        });
    });
    it(`status 404: not found - valid input but has no comments`, () => {
      return request(app)
        .get(`/api/reviews/1/comments`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(`This Review had no comments`);
        });
    });
  });

  describe(`POST /api/reviews/:review_id/comment`, () => {
    it(`status 201, accepts a body with username and body and posts a comment to that review`, () => {
      const data = {
        username: `dav3rid`,
        body: `this is a review without a comment yet`,
      };
      return request(app)
        .post(`/api/reviews/1/comments`)
        .send(data)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toBeInstanceOf(Object);
          expect(Object.entries(comment)).toHaveLength(1);
          expect(Object.entries(comment[0])).toHaveLength(6);
          expect.objectContaining({
            comment_id: expect(comment[0].comment_id).toBe(7),
            body: expect(comment[0].body).toBe(
              "this is a review without a comment yet"
            ),
            votes: expect(comment[0].votes).toBe(0),
            author: expect(comment[0].author).toBe("dav3rid"),
            review_id: expect(comment[0].review_id).toBe(1),
            created_at: expect.any(Date),
          });
        });
    });
    it(`status 400: bad request - invalid key`, () => {
      const data = {
        wrong: `dav3rid`,
        body: `this is a review without a comment yet`,
      };
      return request(app)
        .post(`/api/reviews/1/comments`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 400: bad request - invalid key part 2`, () => {
      const data = {
        username: `dav3rid`,
        wrong: `this is a review without a comment yet`,
      };
      return request(app)
        .post(`/api/reviews/1/comments`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 201, accepts a body with username and body and posts a comment to that review without any extra properties`, () => {
      const data = {
        username: `dav3rid`,
        body: `this is a review without a comment yet`,
        wrong: "this is extra",
      };
      return request(app)
        .post(`/api/reviews/1/comments`)
        .send(data)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toBeInstanceOf(Object);
          expect(Object.entries(comment)).toHaveLength(1);
          expect(Object.entries(comment[0])).toHaveLength(6);
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            review_id: expect.any(Number),
            created_at: expect.any(Date),
          });
        });
    });
    it(`status 400: empty object`, () => {
      const data = {};
      return request(app)
        .post(`/api/reviews/1/comments`)
        .send(data)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    it("status:204, responds with an empty response body", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    it(`status 400: bad request - invalid input`, () => {
      return request(app)
        .delete("/api/comments/wrong")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(`Invalid input`);
        });
    });
    it(`status 404: not found - valid input`, () => {
      return request(app)
        .delete("/api/comments/500")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `input '500' not found in 'reviews' database`
          );
        });
    });
  });
  describe(`GET /api`, () => {
    it(`status 200, serves up a json representation of all the available endpoints of the api`, () => {
      return request(app)
        .get(`/api`)
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
    });
  });
});
