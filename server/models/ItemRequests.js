const mongoose = require("mongoose");

const ItemRequestsSchema = new mongoose.Schema({
  category: {
    type: Number,
    required: true
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
    required: true,
  },
  date: {
    type: String,
    required: true
  },
  listedBy: {
    id: String,
    name: String
  }
});

const ItemRequestsModel = mongoose.model("itemrequests", ItemRequestsSchema);

module.exports = ItemRequestsModel;
