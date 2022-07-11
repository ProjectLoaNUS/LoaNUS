const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
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
    required: false,
  },
  emailToken: String,
  isVerified: Boolean,
  itemsBorrowed: {
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
  admin: {
    type: Boolean,
    required: true,
  },
  rewards: {
    type: Array,
  },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
