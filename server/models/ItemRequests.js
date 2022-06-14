const mongoose = require("mongoose");

const ItemRequestsSchema = new mongoose.Schema({
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
    required: true,
  },
  telegram: {
    type: String,
    required: true,
  }
});

const ItemRequestsModel = mongoose.model("itemrequests", ItemRequestsSchema);

module.exports = ItemRequestsModel;
