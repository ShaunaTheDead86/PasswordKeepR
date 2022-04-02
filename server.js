// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const { Client } = require("pg");

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect();

db.query(
  "SELECT table_schema,table_name FROM information_schema.tables;",
  (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    db.end();
  }
);

// PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    keys: [
      "da097fa0-b5ef-4506-b8c3-28166cb4c4e8",
      "f0553cf8-a720-45d0-abba-e25dbc47eee6",
    ],
  })
);
const currentUser = (req, res, next) => {
  if (req.session["user_id"]) {
    req.currentUser = req.session["user_id"];
  }
  next();
};
app.use(currentUser);
const currentOrg = (req, res, next) => {
  if (req.session["organization_id"]) {
    req.currentOrg = req.session["organization_id"];
  }
  next();
};
app.use(currentOrg);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const credentialsRoutes = require("./routes/credentials");
const usersRoutes = require("./routes/users");
const cetegoriesRoutes = require("./routes/categories");
const apiRoutes = require("./routes/api");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/credentials", credentialsRoutes(db));
app.use("/users", usersRoutes(db));
app.use("/categories", cetegoriesRoutes(db));
app.use("/api", apiRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`PasswordKeepR app listening on port ${PORT}`);
});
