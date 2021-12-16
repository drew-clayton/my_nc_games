# BE Northcoders NC Games Portfolio Check List

This is looking great overall. There's a couple of things to look at with your testing which I've included in the checklist below but overall this is looking strong and ready for hosting. If you haven't already take a look at the hosting notes and make sure that it's all up and running next.

Take a look through the list below and work through the points that need completing but GJ on getting all the endpoints completed :D

## Readme - Remove the one that was provided and write your own:

Once you've finished replace our README with your own. Make sure you include the following:

- [ ] Link to hosted version
- [ ] Write a summary of what the project is
- [ ] Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
- [ ] Include information about how to create `.env.test` and `.env.development` files
- [ ] Specify minimum versions of `Node.js` and `Postgres` needed to run the project

The readme should be written in markdown (the same format as ours) This is a handy [editor](https://readme.so/) if you want some guidance on formatting.

## General

- [ ] Remove any unnecessary `console.logs` and comments - You have a lot of comments across your server which explain your thought process very nicely. Comments are typically written above the code they're commenting on and a few of these are a little redundant. For example:

```js
const express = require("express");
// express ...
```

The variable name is enough to identify this as express and you're not gaining any knowledge or insight from the comment. Commments like this can be skipped so you don't have to repeat yourself for every line of code you write. As a general rule of thumb, if the code isn't self evident then a comment explaining it's purpose is useful. Your functions are well named and explain what they do, the comments should say why they are doing it.

- [ ] Remove all unnecessary files (e.g. old `README.md`, `error-handling.md`, `hosting.md`, `./db/utils/README.md` etc.)
- [x] Functions and variables have descriptive names

## Creating tables

- [x] Use `NOT NULL` on required fields
- [x] Default `created_at` in reviews and comments tables to the current date:`TIMESTAMP DEFAULT NOW()`

## Inserting data

- [x] Drop tables and create tables in seed function in correct order
- [x] Make use of pg-format to insert data in the correct order

## Tests

- [x] Seeding before each test
- [x] Descriptive `it`/`test` block descriptions
- [x] If asserting inside a `forEach`, also has an assertion to check length is at least > 0
- [x] Evidence of building up complex query endpoints using TDD
- [x] Ensure all tests are passing
- [✅] You are using `expect.objectContaining` incorrectly and your assertions will never fail. You need to check it against an object from your test, e.g.

```js
expect(categoryFromTest).toEqual(
  expect.objectContaining({
    slug: expect.any(String),
    description: expect.any(String),
  })
);
```

Go through your tests and make sure that you change each of these, what you have for the properties looks good however :D (comment_count should be a string instead of a number btw)

- [ ] Cover all endpoints and errors

- `GET /api/categories`

  - [x] Status 200, array of category objects

- `GET /api/reviews/:review_id`

  - [x] Status 200, single review object (including `comment_count`)
  - [✅] When you are checking the keys of your object you are checking the types and not the values. As you are requesting a specific id this is not sufficient as it must be the requested review. Consider updating these to hard coded values.
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999

- `PATCH /api/reviews/:review_id`

  - [✅] Status 200, updated single review object - You are responding with an array containing a single object here, as this is a single review object this should just be the object itself, no need for the array
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 400, invalid inc_votes type, e.g. property is not a number
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 200, missing `inc_votes` key. No effect to article.
  - [✅] your test description on `app.test.js:123` has a typo `status 201` should be `status 200`

- `GET /api/reviews`

  - [x] Status 200, array of review objects (including `comment_count`, excluding `body`)
  - [x] Status 200, default sort & order: `created_at`, `desc`
  - [x] Status 200, accepts `sort_by` query, e.g. `?sort_by=votes`
  - [x] Status 200, accepts `order` query, e.g. `?order=desc`
  - [x] Status 200, accepts `category` query, e.g. `?category=dexterity`
  - [x] Status 400. invalid `sort_by` query, e.g. `?sort_by=bananas`
  - [x] Status 400. invalid `order` query, e.g. `?order=bananas`
  - [x] Status 404. non-existent `category` query, e.g. `?category=bananas`
  - [x] Status 200. valid `category` query, but has no reviews responds with an empty array of reviews, e.g. `?category=children's games`

- `GET /api/reviews/:review_id/comments`

  - [x] Status 200, array of comment objects for the specified review
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [✅] Status 200, valid ID, but has no comments responds with an empty array of comments - You use your check exists function correctly but then check the length of the comments array `if (comments.length === 0) {`. There's no need for this if statement as you have already validated that the review_id exists

- `POST /api/reviews/:review_id/comments`

  - [x] Status 201, created comment object
  - [✅] Same thing as PATCH review here with responding with an object instead of an array.
  - [x] Status 400, invalid ID, e.g. string of "not-an-id"
  - [x] Status 404, non existent ID, e.g. 0 or 9999
  - [x] Status 400, missing required field(s), e.g. no username or body properties
  - [x] Status 404, username does not exist
  - [x] Status 201, ignores unnecessary properties
  - [✅] As much as it amuses me to think of `- invalid key part 2` as a film sequel with a dramatic tag line it's not a great test description xD Is it just a leftover copy paste of the previous test?

- `DELETE /api/comments/:comment_id`

  - [x] Status 204, deletes comment from database
  - [x] Status 404, non existent ID, e.g 999
  - [x] Status 400, invalid ID, e.g "not-an-id"

- `GET /api`

  - [x] Status 200, JSON describing all the available endpoints

## Routing

- [x] Split into api, categories, users, comments and reviews routers
- [x] Use `.route` for endpoints that share the same path

## Controllers

- [x] Name functions and variables well
- [✅] Add catch blocks to all model invocations (and don't mix use of`.catch(next);` and `.catch(err => next(err))`) - Just missing `getCategories` :D

## Models

- Protected from SQL injection
  - [x] Using parameterized queries for values in `db.query` e.g `$1` and array of variables
  - [x] Sanitizing any data for tables/columns, e.g. greenlisting when using template literals or pg-format's `%s`
- [x] Consistently use either single object argument _**or**_ multiple arguments in model functions
- [x] Use `LEFT JOIN` for comment counts

## Errors

- [x] Use error handling middleware functions in app and extracted to separate directory/file
- [x] Consistently use `Promise.reject` in either models _**OR**_ controllers

## Extra Tasks - To be completed after hosting

- `GET /api/users`

  - [✅] Status 200, responds with array of user objects

- `GET /api/users/:username`

  - [✅] Status 200, responds with single user object
  - [✅] Status 400, invalid ID, e.g "not-an-id"

- `PATCH /api/comments/:comment_id`

  - [ ] Status 200, updated single comment object
  - [ ] Status 400, invalid ID, e.g. string of "not-an-id"
  - [ ] Status 400, invalid inc_votes type, e.g. property is not a number
  - [ ] Status 404, non existent ID, e.g. 0 or 9999
  - [ ] Status 200, missing `inc_votes` key. No effect to comment.

## Extra Advanced Tasks

### Easier

- [ ] Patch: Edit an review body
- [ ] Patch: Edit a comment body
- [ ] Patch: Edit a user's information
- [ ] Get: Search for an review by title
- [ ] Post: add a new user

### Harder

- [ ] Protect your endpoints with JWT authorization. We have notes on this that will help a bit, _but it will make building the front end of your site a little bit more difficult_
- [ ] Get: Add functionality to get reviews created in last 10 minutes
- [ ] Get: Get all reviews that have been liked by a user. This will require an additional junction table.
- [ ] Research and implement online image storage or random generation of images for categories
