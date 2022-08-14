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
        if (query.isFullSearch === "true") {
          // Full search, so search within listing description as well
          results = await ItemListingsModel.aggregate([
            {
              $search: {
                index: "listings",
                compound: {
                  should: [
                    {
                      autocomplete: {
                        query: `${query.name}`,
                        path: "title",
                        fuzzy: {
                          maxEdits: 2,
                        },
                        tokenOrder: "sequential",
                      }
                    },
                    {
                      text: {
                        query: `${query.name}`,
                        path: ["description"]
                      }
                    }
                  ],
                  "minimumShouldMatch": 1
                }
              },
            },
            {
              $limit: 15,
            },
            {
              $project: resultData,
            },
          ]);
        } else { // Non-full search, only search listing titles
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
        }
        if (results) {
          return response.status(200).json({ results: results });
        }
      }
      response.status(400).json({ error: "Missing search query" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error });
    }
});
// Finds a specific item listing by its MongoDB _id
router.get("/search-exact", async (request, response) => {
    try {
      const query = request.query;
      if (!query.id) {
        return response.status(400).json({ error: "Missing item listing ID" });
      }
      const result = await ItemListingsModel.findOne({
        _id: query.id,
      });
      if (result) {
        return response.status(200).json({ result: result });
      }
      response.status(400).json({ error: "Invalid item listing ID provided" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ error: error });
    }
});

module.exports = router;