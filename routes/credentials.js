/*
 * All routes for Credentials are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /credentials
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const { encrypt, decrypt } = require("../encryption/encryption");
module.exports = (db) => {
  // GET /credentials - get all credentials
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM credentials;`)
      .then((data) => {
        const credentials = data.rows;
        //decrypt password before returning to front-end
        getConfig("ENCRYPTION_KEY").then((secretKey) => {
          for (const credential of credentials) {
            credential.password = decrypt(credential.password, secretKey.value);
          }
        });
        res.json({ credentials });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET only IDs from /credentials
  router.get("/id", (req, res) => {
    db.query(`SELECT id FROM credentials;`)
      .then((data) => {
        const credentials = data.rows;
        res.json({ credentials });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // POST /credentials - create a new credential
  router.post("/", (req, res) => {
    // get user_id and organization_id from session
    const userId = req.currentUser || 2;
    const orgId = req.currentOrg || 2;

    //prepare query for insert new credential
    getConfig("ENCRYPTION_KEY").then((secretKey) => {
      const insertParams = [
        req.body.username,
        encrypt(req.body.password, secretKey.value),
        req.body.url,
        req.body.name,
        userId,
        orgId,
        req.body.categoryId,
        req.body.logo_url ? req.body.logo_url : "../images/passwordkeepr.png",
      ];

      const insertQueryString = `
        INSERT INTO credentials (username, password, url, name, creator_id, organization_id, category_id, logo_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `;

      db.query(insertQueryString, insertParams)
        .then((data) => {
          credential = data.rows[0];
          templateVars = { credential };
          res.render("index", templateVars);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err.message });
        });
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

  return router;
};
