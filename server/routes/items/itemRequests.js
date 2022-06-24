const express = require("express");
const router = express.Router();
const ItemRequestsModel = require("../../models/ItemRequests");
const UserModel = require("../../models/Users");

router.post("/addRequest", async (req, res) => {
    const obj = {
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      telegram: req.body.telegram,
      date: req.body.date,
      userName: req.body.userName
    };
    ItemRequestsModel.create(obj, (err, request) => {
      if (err) {
        console.log(err);
        return res.json({status: 'error'});
      } else {
        request.save().then(savedRequest => {
          UserModel.findOne({
            email: req.body.email
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
    ItemRequestsModel.find({}, ['_id', 'category', 'title', 'description', 'location', 'telegram', 'date', 'userName'], null, (err, requests) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({status: 'ok', requests: requests});
        }
    });
});
router.post("/getRequestsOfUser", async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({
    email: email
  });
  if (!user) {
    return res.json({status: 'error'});
  }
  const requestIds = user.itemsRequested;
  let requests = await ItemRequestsModel.find({'_id': { $in: requestIds} }, ['category', 'title', 'description', 'location', 'telegram', 'date', 'userName']);
  return res.json({status: 'ok', requests: requests});
});

module.exports = router;