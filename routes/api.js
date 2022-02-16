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

  router.get("/credentials/id", (req, res) => {
    const queryString = `SELECT *
    FROM credentials
    WHERE id = $1;`;
    const queryParams = [req.query.passwordID];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        console.log(err);
      })
  });

  router.get("/credentials/delete", (req, res) => {
    const queryString = `
    DELETE FROM credentials
    WHERE id = $1`
    const queryParams = [req.query.passwordID];

    db.query(queryString, queryParams)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/categories/uncategorized", (req, res) => {
    db.query("SELECT * FROM categories WHERE name = 'Uncategorized'")
      .then(data => {
        res.send(data.rows);
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

    db.query(queryString, queryParams)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/credentials/move", (req, res) => {
    const queryString = `
    UPDATE credentials
    SET category_id = $1
    WHERE category_id = $2;`
    const queryParams = [req.body.newCategory, req.body.target];

    db.query(queryString, queryParams)
      .then(data => {
        res.send(data.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/categories/create", (req, res) => {
    const queryString = `INSERT INTO categories (name)
    VALUES ($1)`
    const queryParams = [req.body.name];

    db.query(queryString, queryParams)
      .then(data => {
        res.send(data.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/categories/delete", (req, res) => {
    const queryString = `
    DELETE FROM categories
    WHERE id = $1`
    const queryParams = [req.body.target];

    db.query(queryString, queryParams)
      .then(data => {
        res.send(data.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/categories/edit", (req, res) => {
    const queryString = `
    UPDATE categories
    SET name = $1
    WHERE id = $2;`
    const queryParams = [req.body.newName, req.body.oldName];

    db.query(queryString, queryParams)
      .then(data => {
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
          req.session["organization_id"] = data.rows[0].organization_id;
          res.send(data.rows[0]);
        }
      })
  });

  return router;
};
