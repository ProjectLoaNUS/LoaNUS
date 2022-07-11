const express = require("express");
const router = express.Router();
const RewardsModel = require("../models/Rewards");
const multer = require("multer");
const UserModel = require("../models/Users");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 15 },
});

//new reward
router.post("/createreward", upload.single("image"), (req, res) => {
  try {
    const imageprop = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

    const data = {
      description: req.body.description,
      category: req.body.category,
      title: req.body.title,
      claimed: req.body.claimed,
      points: req.body.points,
      image: imageprop,
      deadline: req.body.deadline,
    };
    const reward = new RewardsModel(data);
    const savedreward = reward.save();
    console.log(data);

    res.status(200).json(savedreward);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get rewards
router.get("/getrewards", async (req, res) => {
  try {
    const searchcat = req.query.category;

    const array = await RewardsModel.find({ category: searchcat });

    res.status(200).send(array);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/claimreward", async (req, res) => {
  try {
    const itemId = req.body.item;
    const userId = req.body.user;

    let usermodel = await UserModel.findById(userId);
    let rewardmodel = await RewardsModel.findById(itemId);

    if (!usermodel.rewards.includes(itemId)) {
      usermodel.rewards.push(itemId);
    }
    rewardmodel.claimed = true;
    await usermodel.save();
    await rewardmodel.save();
    res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
