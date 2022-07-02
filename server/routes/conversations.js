const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv
router.post("/", async (req, res) => {
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

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
