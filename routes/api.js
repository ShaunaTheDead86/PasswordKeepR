const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/categories", (req, res) => {
    db.query(`SELECT *
    FROM categories;`)
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

  router.post("/credentials/edit", (req, res) => {
    const queryString = `
    UPDATE credentials
    SET username = $1,
    password = $2,
    url = $3,
    name = $4,
    category_id = $5
    WHERE id = $6;`
    const queryParams = [req.body.username, req.body.password, req.body.url, req.body.name, req.body.categoryId, req.body['password-id']];

    console.log(queryString, queryParams);

    db.query(queryString, queryParams)
      .then(data => {
        console.log("data updated", data);
        res.send(data);
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

  router.post("/credentials/edit", (req, res) => {
    const params = [req.body.username, req.body.password];
    db.query(`
    ALTER TABLE
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
