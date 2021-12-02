\c nc_games_test
\echo
\echo /////////////////////////////////////////////////////////////////////
\echo





\echo
\echo /////////////////////////////////////////////////////////////////
\echo

   SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, COUNT(comments) AS comment_count FROM reviews  
   LEFT JOIN comments ON comments.review_id = reviews.review_id
   WHERE category = category
   GROUP BY reviews.review_id
   ORDER BY votes ASC;