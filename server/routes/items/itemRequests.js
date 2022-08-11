const itemRequests = (socketUtils) => {
  const express = require("express");
  const router = express.Router();
  const ItemRequestsModel = require("../../models/ItemRequests");
  const UserModel = require("../../models/Users");
  const auth = require("../../utils/auth");

  const findMatchingListings = async (request) => {
    const requestId = "" + request._id;
    const requestTitle = request.title;
    const owner = request.listedBy;
    if (requestTitle) {
      const ItemListingsModel = require("../../models/ItemListings");
      const resultData = {
        _id: 1,
        category: 1
      };
      let results = await ItemListingsModel.aggregate([
        {
          $search: {
            index: "listings",
            text: {
              query: requestTitle,
              path: ["title", "description"]
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
      if (results?.length) {
        let matchingListings = request.matchingListings && [...request.matchingListings];
        for (const listing of results) {
          // Matching listing must be the same category as item request
          if (listing.category === request.category) {
            const listingId = "" + listing._id;
            const thisListing = await ItemListingsModel.findOne({ _id: listingId });
            const listOwnerId = thisListing.listedBy.id;
            // Matching listing is created by another user
            if (listOwnerId !== owner.id) {
              // Notify user who made this request that a potential match was found
              socketUtils.notify(null, owner.id,
                  `New match for your request ${requestTitle}`, "/profile/requests");
              if (matchingListings && !matchingListings.includes(listingId)) {
                matchingListings.push(listingId);
              } else if (!matchingListings) {
                matchingListings = [listingId];
              }
            }
          }
        }
        ItemRequestsModel.findOneAndUpdate({ _id: requestId },
            { matchingListings: matchingListings }).exec();
      }
    } else {
      console.log("Invalid listing title passed to findMatchingRequests()");
    }
  };
  router.post("/addRequest", async (req, res) => {
      if (!req.user || !req.user.id) {
        return res.json({status: "error"});
      }
      const userId = req.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return res.json({status: "error"});
      }

      const creator = req.body.listedBy;
      if (!creator) {
        return res.json({status: 'error'});
      }
      const obj = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        listedBy: creator
      };
      ItemRequestsModel.create(obj, (err, request) => {
        if (err) {
          console.log(err);
          return res.json({status: 'error'});
        } else {
          request.save().then(savedRequest => {
            findMatchingListings(savedRequest);
            let itemsRequested = user.itemsRequested;
            const requestId = "" + savedRequest._id;
            if (!itemsRequested) {
              itemsRequested = [requestId];
              user.itemsRequested = itemsRequested;
              user.save();
            } else if (!itemsRequested.includes(requestId)) {
              itemsRequested.push(requestId);
              user.itemsRequested = itemsRequested;
              user.save();
            }
          });
          return res.json({status: 'ok'});
        }
      });
  });

  router.get("/getRequests", (req, res) => {
      ItemRequestsModel.find({}, ['_id', 'category', 'title', 'description', 'location', 'date', 'listedBy'], null, (err, requests) => {
          if (err) {
            res.status(500).json({error: err});
          } else {
            res.status(200).json({requests: requests});
          }
      });
  });
  router.get("/getRequestsOfUser", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.json({status: "error"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.json({status: "error"});
    }

    const requestIds = user.itemsRequested;
    let requests = await ItemRequestsModel.find({'_id': { $in: requestIds} }, ['category', 'title', 'description', 'location', 'date', 'listedBy', 'matchingListings']);
    return res.json({status: 'ok', requests: requests});
  });
  router.post("/getMatchingListingsOf", async (req, res) => {
    const requestId = req.body.requestId;
    if (!requestId) {
      return res.json({status: "error", message: "Invalid request ID provided"});
    }
    const request = await ItemRequestsModel.findOne({ _id: requestId }, ['matchingListings']);
    if (!request) {
      return res.json({status: "error", message: `Unable to find request with ID ${requestId}`});
    }
    const matchingListings = request.matchingListings;
    return res.json({status: "ok", matchingListings: matchingListings});
  })

  router.post("/rmRequest", async (request, response) => {
    if (!request.user || !request.user.id) {
      return response.json({status: "error"});
    }
    const userId = request.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return response.json({status: "error"});
    }
  
    const itemId = request.body.itemId;
    if (itemId) {
      await ItemRequestsModel.deleteOne({ _id: itemId });
      response.json({status: "ok"});
    } else {
      response.json({status: "error"});
    }
  });

  return router;
}

module.exports = itemRequests;