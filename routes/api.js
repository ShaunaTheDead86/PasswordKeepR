const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/categories", (req, res) => {
    db.query(`SELECT name FROM categories;`)
      .then(data => {
        const categories = data.rows;
        res.json({ categories });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
