const router = require("express").Router();
const Conversation = require("../models/Conversation");
const auth = require("../utils/auth");

//new conv
router.post("/", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  if (!req.body.senderId) {
    return res.status(500).json({error: "Invalid sender"});
  }
  if (!req.body.receiverId) {
    return res.status(500).json({error: "Invalid receiver"});
  }
  const users = [req.body.senderId, req.body.receiverId];
  let conversation = await Conversation.findOne({ members: { $all: users } });
  if (!conversation) {
    conversation = new Conversation({
      members: users,
    });
  }

  try {
    const savedConversation = await conversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/find", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:otherUserId", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const conversation = await Conversation.findOne({
      members: { $all: [userId, req.params.otherUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
