/*
 * All routes for Credentials are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /credentials
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

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

  // GET only IDs from /credentials
  router.get("/id", (req, res) => {
    db.query(`SELECT id FROM credentials;`)
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

    // get user_id and organization_id from session
    const userId = req.currentUser || 2;
    const orgId = req.currentOrg || 2;

    //prepare query for insert new credential
    const insertParams = [
      req.body.username,
      req.body.password,
      req.body.url,
      req.body.name,
      userId,
      orgId,
      req.body.categoryId
    ];

    const insertQueryString = `
      INSERT INTO credentials (username, password, url, name, creator_id, organization_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `;
   db.query(insertQueryString, insertParams)
    .then(data => {
      credential = data.rows[0];
      templateVars = { credential }
      res.render("index", templateVars);
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: err.message });
    });
  })
  
  return router;
}
