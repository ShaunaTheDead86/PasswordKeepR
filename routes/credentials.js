/*
 * All routes for Credentials are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /credentials
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // GET /credentials - get all credentials
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM credentials;`)
      .then(data => {
        const credentials = data.rows;
        res.json({ credentials });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // POST /credentials - create a new credential
  router.post("/", (req, res) => {

    // to be replaced when session userid is available
    const userId = req.session["user_id"] || 2;

    // prepare first query to get organization_id 
    const queryString = `
      SELECT * FROM users
      WHERE id = $1;
    `;
    db.query(queryString, [userId])
      .then(data => {

        //prepare 2nd query for insert new credential
        const insertParams = [
          req.body.username, 
          req.body.password, 
          req.body.url, 
          req.body.name, 
          userId,
          data.rows[0].organization_id,
          req.body.categoryId
        ];
        
        const insertQueryString = `
          INSERT INTO credentials (username, password, url, name, creator_id, organization_id, category_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *;
        `;
        return db.query(insertQueryString, insertParams);
      })
      .then(data => {
        credential = data.rows[0] ;
        templateVars = {credential}
        res.render("index", templateVars);
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
