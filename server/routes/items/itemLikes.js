const express = require("express");
const router = express.Router();
const multer = require("multer");
const ItemListingsModel = require("../../models/ItemListings");
const UserModel = require("../../models/Users");
const auth = require("../../utils/auth");

//add like item
router.post("/likeitem", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(500).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(500).json({error: "JWT User ID is invalid"});
  }

  const itemId = req.body.itemId;
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
  if (!req.user || !req.user.id) {
    return res.status(500).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(500).json({error: "JWT User ID is invalid"});
  }

  const itemId = req.body.itemId;
  if (user.itemsLiked.includes(itemId)) {
    user.itemsLiked = user.itemsLiked.filter(function (item) {
      return item !== itemId;
    });
  }
  try {
    await user.save();
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get liked items

router.get("/getlikeditems", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(500).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(500).json({error: "JWT User ID is invalid"});
    }

    let items = user.itemsLiked;
    res.status(200).json({ status: "success", items: items });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
