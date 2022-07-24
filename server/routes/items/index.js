const items = (socketUtils) => {
      const express = require("express");
      const router = express.Router();
      const listings = require("./itemListings")(socketUtils);
      const requests = require("./itemRequests")(socketUtils);
      const search = require("./search");

      router.use("/items", listings)
            .use("/items", requests)
            .use("/items", search);

      return router;
}

module.exports = items;