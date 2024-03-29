const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      data: Buffer,
      contentType: String,
      url: String,
      required: false,
    },
    emailToken: String,
    isVerified: Boolean,
    itemsBorrowed: {
      type: [String],
      required: false,
    },
    itemBorrowRequests: {
      type: [String],
      required: false,
    },
    itemsListed: {
      type: [String],
      required: false,
    },
    itemsRequested: {
      type: [String],
      required: false,
    },
    itemsLiked: {
      type: [String],
    },
    points: {
      type: Number,
      required: true,
    },
    followers: {
      type: Array,
    },
    following: {
      type: Array,
    },
    recommendation: {
      type: Array,
      required: true,
      maxlength: 10,
    },
    admin: {
      type: Boolean,
      required: false,
    },
    rewards: {
      type: Array,
    },
    reviews: {
      type: Array,
    },
    reviewscreated: {
      type: Array,
    },
    otp: {
      type: Number,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
