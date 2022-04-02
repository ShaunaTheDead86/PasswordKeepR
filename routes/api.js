const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../encryption/encryption");

const targetURL = "ec2-3-217-251-77.compute-1.amazonaws.com";

module.exports = (db) => {
  router.get(targetURL + "/categories", (req, res) => {
    db.query(
      `SELECT *
    FROM categories;`
    )
      .then((data) => {
        const categories = data.rows;
        res.json({ categories });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get(targetURL + "/credentials", (req, res) => {
    db.query(
      `SELECT *
    FROM credentials;`
    )
      .then((data) => {
        const credentials = data.rows;
        //decrypt password before returning to front-end
        getConfig("ENCRYPTION_KEY").then((secretKey) => {
          for (const credential of credentials) {
            credential.password = decrypt(credential.password, secretKey.value);
          }
          res.json({ credentials });
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get(targetURL + "/credentials/id", (req, res) => {
    const queryString = `SELECT *
    FROM credentials
    WHERE id = $1;`;
    const queryParams = [req.query.passwordID];

    db.query(queryString, queryParams)
      .then((data) => {
        const credentials = data.rows;
        //decrypt password before returning to front-end
        getConfig("ENCRYPTION_KEY").then((secretKey) => {
          for (const credential of credentials) {
            credential.password = decrypt(credential.password, secretKey.value);
          }
          res.send(credentials);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.get(targetURL + "/credentials/delete", (req, res) => {
    const queryString = `
    DELETE FROM credentials
    WHERE id = $1`;
    const queryParams = [req.query.passwordID];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get(targetURL + "/categories/uncategorized", (req, res) => {
    db.query("SELECT * FROM categories WHERE name = 'Uncategorized'")
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(targetURL + "/credentials/edit", (req, res) => {
    const queryString = `
    UPDATE credentials
    SET username = $1,
    password = $2,
    url = $3,
    name = $4,
    category_id = $5
    WHERE id = $6;`;

    // encrypt password before storing in DB
    getConfig("ENCRYPTION_KEY").then((secretKey) => {
      const queryParams = [
        req.body.username,
        encrypt(req.body.password, secretKey.value),
        req.body.url,
        req.body.name,
        req.body.categoryId,
        req.body["password-id"],
      ];
      db.query(queryString, queryParams)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    });
  });

  router.post(targetURL + "/credentials/move", (req, res) => {
    const queryString = `
    UPDATE credentials
    SET category_id = $1
    WHERE category_id = $2;`;
    const queryParams = [req.body.newCategory, req.body.target];

    db.query(queryString, queryParams)
      .then((data) => {
        const credentials = data.rows;
        //decrypt password before returning to front-end
        getConfig("ENCRYPTION_KEY").then((secretKey) => {
          for (const credential of credentials) {
            credential.password = decrypt(credential.password, secretKey.value);
          }
          res.send(credentials);
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(targetURL + "/categories/create", (req, res) => {
    const queryString = `INSERT INTO categories (name)
    VALUES ($1)`;
    const queryParams = [req.body.name];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(targetURL + "/categories/delete", (req, res) => {
    const queryString = `
    DELETE FROM categories
    WHERE id = $1`;
    const queryParams = [req.body.target];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(targetURL + "/categories/edit", (req, res) => {
    const queryString = `
    UPDATE categories
    SET name = $1
    WHERE id = $2;`;
    const queryParams = [req.body.oldName, req.body.newName];

    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post(targetURL + "/login", (req, res) => {
    const params = [req.body.username];
    db.query(
      `
    SELECT *
    FROM users
    WHERE username = $1
    ;`,
      params
    )
      .then((data) => {
        if (data.rows && data.rows.length > 0) {
          if (bcrypt.compareSync(req.body.password, data.rows[0].password)) {
            req.session["user_id"] = data.rows[0].id;
            req.session["organization_id"] = data.rows[0].organization_id;
            res.send(data.rows[0]);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  const getConfig = function (attr) {
    return db
      .query(`SELECT * FROM configurations WHERE attribute = $1;`, [attr])
      .then((data) => {
        if (data.rows.length > 0) {
          return data.rows[0];
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // search for specific website_name and its password
  router.post(targetURL + "/credentials/search", (req, res) => {
    const queryString = `
  SELECT id, name, password
  FROM credentials
  WHERE upper(name) LIKE $1;`;

    const queryParams = [`%${req.body.website.toUpperCase()}%`];

    db.query(queryString, queryParams)
      .then((data) => {
        const searchResult = data.rows;
        res.json({ searchResult });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
