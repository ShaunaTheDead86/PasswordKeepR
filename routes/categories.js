/*
 * All routes for Credentials are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /credentials
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const targetURL = "ec2-3-217-251-77.compute-1.amazonaws.com";

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get(targetURL + "/", (req, res) => {
    db.query(`SELECT * FROM categories;`)
      .then((data) => {
        const categories = data.rows;
        res.send(categories);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
