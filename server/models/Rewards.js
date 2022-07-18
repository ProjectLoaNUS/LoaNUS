const mongoose = require("mongoose");

const RewardsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
    required: false,
  },
  location: {
    type: String,
  },
  claimed: {
    type: Boolean,
    required: true,
  },
  howToRedeem: {
    url: String,
    qrCode: {
      data: Buffer,
      contentType: String,
    }
  }
});

const RewardsModel = mongoose.model("rewards", RewardsSchema);

module.exports = RewardsModel;
