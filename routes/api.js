const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/categories", (req, res) => {
<<<<<<< HEAD
    db.query(`
    SELECT categories.name as category, credentials.name as password_name, credentials.password
    FROM categories
    JOIN credentials ON categories.id = category_id
    ;`)
=======
    db.query(`SELECT *
    FROM categories;`)
>>>>>>> master
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

  router.get("/credentials", (req, res) => {
    db.query(`SELECT *
    FROM credentials;`)
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

  return router;
};
