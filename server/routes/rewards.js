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
const rewardImgs = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'howToRedeemQrCode', maxCount: 1 }
]);
router.post("/createreward", rewardImgs, (req, res) => {
  try {
    const image = req.files['image'][0];
    const imageprop = {
      data: image.buffer,
      contentType: image.mimetype,
    };

    let data = {
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      points: req.body.points,
      deadline: req.body.deadline,
      image: imageprop,
      claimed: req.body.claimed
    };
    let howToRedeem = {};
    const howToRedeemUrl = req.body.howToRedeemUrl;
    if (howToRedeemUrl) {
      howToRedeem.url = howToRedeemUrl;
    }
    console.log(req.files);
    const howToRedeemQrCode = req.files['howToRedeemQrCode'];
    if (howToRedeemQrCode?.length) {
      howToRedeem.qrCode = {
        data: howToRedeemQrCode[0].buffer,
        contentType: howToRedeemQrCode[0].mimetype
      };
    }
    data.howToRedeem = howToRedeem;
    const reward = new RewardsModel(data);
    const savedreward = reward.save();

    res.status(200).json(savedreward);
  } catch (err) {
    console.log(err);
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
    usermodel.points -= rewardmodel.points;
    rewardmodel.claimed = true;
    await usermodel.save();
    await rewardmodel.save();
    res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user rewards
router.post("/getRewardsOfUser", async (req, res) => {
  if (!req.body.userId) {
    return res.json({ status: "error" });
  }
  const user = await UserModel.findOne({
    _id: req.body.userId,
  });
  if (!user) {
    return res.json({ status: "error" });
  }
  const rewardsIds = user.rewards;
  let rewards = await RewardsModel.find({ _id: { $in: rewardsIds } });
  return res.json({ status: "ok", rewards: rewards });
});

module.exports = router;
