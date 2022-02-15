const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/categories", (req, res) => {
    db.query(`
    SELECT categories.name as category, credentials.name as password_name, credentials.password
    FROM categories
    JOIN credentials ON categories.id = category_id
    ;`)
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
