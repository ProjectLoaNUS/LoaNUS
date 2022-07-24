const express = require("express");
const router = express.Router();
const multer = require("multer");
const ItemListingsModel = require("../../models/ItemListings");
const UserModel = require("../../models/Users");

//add like item
router.post("/likeitem", async (req, res) => {
  const itemId = req.body.itemId;
  const userId = req.body.userId;
  let user = await UserModel.findById(userId);

  if (!user.itemsLiked.includes(itemId)) {
    user.itemsLiked.push(itemId);
  }
  try {
    await user.save();
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json(err);
  }
});
//remove like item
router.post("/unlikeitem", async (req, res) => {
  const itemId = req.body.itemId;
  const userId = req.body.userId;
  let user = await UserModel.findById(userId);

  if (user.itemsLiked.includes(itemId)) {
    user.itemsLiked = user.itemsLiked.filter(function (item) {
      return item !== itemId;
    });
  }
  try {
    await user.save();
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json(err);
  }
});

//get liked items

router.get("/getlikeditems", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await UserModel.findById(userId);
    let items = user.itemsLiked;
    res.status(200).json({ status: "success", items: items });
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
