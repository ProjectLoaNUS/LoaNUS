const express = require("express");
const router = express.Router();
const listings = require("./itemListings");
const requests = require("./itemRequests");
const search = require("./search");
const itemlikes = require("./itemLikes");

router
  .use("/items", listings)
  .use("/items", requests)
  .use("/items", search)
  .use("/items", itemlikes);

module.exports = router;
