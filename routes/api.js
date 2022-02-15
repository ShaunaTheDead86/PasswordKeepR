const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/categories", (req, res) => {
    db.query(`
    SELECT categories.name as category, credentials.name as password_name
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

  router.post("/login", (req, res) => {
    const params = [req.body.username, req.body.password];
    db.query(`
    SELECT *
    FROM users
    WHERE username = $1 
    AND password = $2
    ;`, params)
      .then(data => {
        if (data.rows && data.rows.length > 0) {
          req.session["user_id"] = data.rows[0].id;
          res.send(data.rows[0]);
        }
      })
  });
  router.get("/credentials", (req, res) => {
    db.query(`SELECT id FROM credentials;`)
      .then(data => {
        return data.rows;
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
