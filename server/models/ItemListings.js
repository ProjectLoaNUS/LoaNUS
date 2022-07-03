const mongoose = require("mongoose");

const ItemListingsSchema = new mongoose.Schema({
  images: {
    data: [Buffer],
    contentType: [String]
  },
  deadline: {
    type: String,
    required: true
  },
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
  },
  borrowedBy: {
    type: String,
    required: false
  }
});

const ItemListingsModel = mongoose.model("itemlistings", ItemListingsSchema);

module.exports = ItemListingsModel;
