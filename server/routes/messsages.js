const router = require("express").Router();
const Message = require("../models/Message");
const auth = require("../utils/auth");

//add a message

router.post("/", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a message

router.get("/:conversationId", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
