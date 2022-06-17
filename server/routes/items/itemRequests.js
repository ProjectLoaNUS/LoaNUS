const express = require("express");
const router = express.Router();
const ItemRequestsModel = require("../../models/ItemRequests");

router.post("/addRequest", async (req, res) => {
    console.log(req);
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
        request.save();
        return res.json({status: 'ok'});
      }
    });
});
router.get("/getRequests", (req, res) => {
    ItemRequestsModel.find({}, ['category', 'title', 'description', 'location', 'telegram', 'date', 'userName'], null, (err, requests) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({status: 'ok', requests: requests});
        }
    });
});

module.exports = router;