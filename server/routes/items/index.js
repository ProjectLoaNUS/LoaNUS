const express = require("express");
const router = express.Router();
const listings = require("./itemListings");
const requests = require("./itemRequests");
const search = require("./search");

router.use("/items", listings)
      .use("/items", requests)
      .use("/items", search);

module.exports = router;