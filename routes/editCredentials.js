// routes for editing credentials
const express = require('express');
const router = express.Router();

module.exports = (db) => {
  // POST /credentials/edit - edit a credential
  router.post("/credentials/edit", (req, res) => {

    // prepare parameters for update from form
    const updateParams = [
      req.body.id,
      req.body.username,
      req.body.password,
      req.body.logo_url,
      req.body.url,
      req.body.name,
      userId,
      data.rows[0].organization_id,
      req.body.categoryId
    ];

    const updateQueryString = `UPDATE credentials
SET username = $1,
password = $2,
logo_url = $3,
url = $4,
name = $5,
creator_id = $6,
organization_id = $7,
category_id = $8
WHERE id = $9;`;

    db.query(updateQueryString, updateParams)
      .then(data => {
        return renderCatagories();
      })
      .catch(err => {
        console.log(err)
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
