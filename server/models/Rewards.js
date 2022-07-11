const mongoose = require("mongoose");

const RewardsSchema = new mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
    required: false,
  },
  deadline: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  claimed: {
    type: Boolean,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
});

const RewardsModel = mongoose.model("rewards", RewardsSchema);

module.exports = RewardsModel;
