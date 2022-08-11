const express = require("express");
const router = express.Router();
const RewardsModel = require("../models/Rewards");
const multer = require("multer");
const UserModel = require("../models/Users");
const auth = require("../utils/auth");

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
router.post("/createreward", rewardImgs, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
    if (!user.admin) {
      return res.status(403).json({error: `Access denied: ${user.name} is not an admin`});
    }

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
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const itemId = req.body.item;

    let rewardmodel = await RewardsModel.findById(itemId);

    if (!user.rewards.includes(itemId)) {
      user.rewards.push(itemId);
    }
    user.points -= rewardmodel.points;
    rewardmodel.claimed = true;
    await user.save();
    await rewardmodel.save();
    res.status(200).json({points: user.points});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/rmreward", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
    if (!user.admin) {
      return res.status(403).json({error: `Access denied: ${user.name} is not an admin`});
    }

    const rewardId = req.body.rewardId;
    if (!rewardId) {
      return res.status(500).json({message: "Reward ID not given"});
    }
    await RewardsModel.deleteOne({ _id: rewardId });
    return res.status(200).json({message: "Reward deleted"});
  } catch (err) {
    console.log(err);
    return res.status(500).json({message: err});
  }
});

// get user rewards
router.get("/getRewardsOfUser", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  const rewardsIds = user.rewards;
  let rewards = await RewardsModel.find({ _id: { $in: rewardsIds } });
  return res.status(200).json({rewards: rewards});
});

module.exports = router;
