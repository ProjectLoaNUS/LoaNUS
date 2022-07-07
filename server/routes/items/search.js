const express = require("express");
const router = express.Router();
const ItemListingsModel = require("../../models/ItemListings");

// Autocomplete search for frontend's item search bar
router.get("/search", async (request, response) => {
    try {
      const query = request.query;
      let results;
      if (query.name) {
        let resultData;
        if (query.isFullSearch === "true") {
          if (query.isImageOnly === "true") {
            resultData = {
              images: 1,
            };
          } else if (query.isTextOnly === "true") {
            resultData = {
              _id: 1,
              title: 1,
              category: 1,
              description: 1,
              location: 1,
              date: 1,
              listedBy: 1,
              deadline: 1,
              borrowedBy: 1,
            };
          } else {
            resultData = {
              _id: 1,
              title: 1,
              category: 1,
              description: 1,
              location: 1,
              date: 1,
              listedBy: 1,
              deadline: 1,
              images: 1,
              borrowedBy: 1,
            };
          }
        } else {
          resultData = {
            title: 1,
            borrowedBy: 1,
            _id: 1,
          };
        }
        results = await ItemListingsModel.aggregate([
          {
            $search: {
              index: "listings",
              autocomplete: {
                query: `${query.name}`,
                path: "title",
                fuzzy: {
                  maxEdits: 2,
                },
                tokenOrder: "sequential",
              },
            },
          },
          {
            $limit: 15,
          },
          {
            $project: resultData,
          },
        ]);
        if (results) {
          return response.json({ status: "ok", results: results });
        }
      }
      response.json({ status: "error" });
    } catch (error) {
      console.log(error);
      response.json({ status: "error" });
    }
});
// Finds a specific item listing by its MongoDB _id
router.get("/search-exact", async (request, response) => {
    try {
      const query = request.query;
      if (!query.id) {
        return response.json({ status: "error" });
      }
      const result = await ItemListingsModel.findOne({
        _id: query.id,
      });
      if (result) {
        return response.json({ status: "ok", result: result });
      }
      response.json({ status: "error" });
    } catch (error) {
      console.log(error);
      response.json({ status: "error" });
    }
});

module.exports = router;