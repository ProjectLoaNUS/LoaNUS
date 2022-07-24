const itemRequests = (socketUtils) => {
  const express = require("express");
  const router = express.Router();
  const ItemRequestsModel = require("../../models/ItemRequests");
  const UserModel = require("../../models/Users");

  router.post("/addRequest", async (req, res) => {
      const creator = req.body.listedBy;
      if(!creator) {
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
            UserModel.findOne({
              _id: creator.id
            }, (err, user) => {
              if (err) {
                console.log(err);
              } else if (user) {
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
              }
            });
          });
          return res.json({status: 'ok'});
        }
      });
  });

  router.get("/getRequests", (req, res) => {
      ItemRequestsModel.find({}, ['_id', 'category', 'title', 'description', 'location', 'date', 'listedBy'], null, (err, requests) => {
          if (err) {
            res.status(500).send("An error occurred", err);
          } else {
            res.json({status: 'ok', requests: requests});
          }
      });
  });
  router.post("/getRequestsOfUser", async (req, res) => {
    const userId = req.body.userId;
    const user = await UserModel.findOne({
      _id: userId
    });
    if (!user) {
      return res.json({status: 'error'});
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