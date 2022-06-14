const express = require("express");
const router = express.Router();
const listings = require("./itemListings");

router.use("/items", listings);

module.exports = router;