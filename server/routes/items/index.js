const express = require("express");
const router = express.Router();
const listings = require("./itemListings");
const requests = require("./itemRequests");

router.use("/items", listings)
      .use("/items", requests);

module.exports = router;