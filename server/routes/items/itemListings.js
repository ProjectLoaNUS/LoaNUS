const express = require("express");
const router = express.Router();
const multer = require("multer");
const ItemListingsModel = require("../../models/ItemListings");
const UserModel = require("../../models/Users");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 15 },
});
const filesToImgArray = (files) => {
    let data = [];
    let type = [];
    files.forEach(file => {
        data.push(file.buffer);
        type.push(file.mimetype);
    });
    return {
        data: data,
        contentType: type
    }
}
router.post("/addListing", upload.array("images", 4), (request, response, next) => {
    const obj = {
      images: filesToImgArray(request.files),
      deadline: request.body.deadline,
      category: request.body.category,
      title: request.body.title,
      description: request.body.description,
      location: request.body.location,
      telegram: request.body.telegram,
      date: request.body.date,
      listedBy: JSON.parse(request.body.listedBy)
    };
    ItemListingsModel.create(obj, (err, listing) => {
      if (err) {
        console.log(err);
      } else {
        listing.save().then(savedListing => {
          UserModel.findOne({
            email: request.body.email
          }, (err, user) => {
            if (err) {
              console.log(err);
            } else if (user) {
              let itemsListed = user.itemsListed;
              const listingId = "" + savedListing._id;
              if (!itemsListed) {
                user.itemsListed = [listingId];
                user.save();
              } else if (!itemsListed.includes(listingId)) {
                itemsListed.push(listingId);
                user.itemsListed = itemsListed;
                user.save();
              }
            }
          });
        });
      }
    });
    return response.json({status: 'ok'});
});
router.post("/rmListing", async (request, response) => {
  const itemId = request.body.itemId;
  if (itemId) {
    await ItemListingsModel.deleteOne({ _id: itemId });
    response.json({status: "ok"});
  } else {
    response.json({status: "error"});
  }
});
router.get("/getListingsTexts", (req, res) => {
    ItemListingsModel.find({}, ['_id', 'category', 'title', 'deadline', 'description', 'location', 'telegram', 'date', 'listedBy', 'borrowedBy'], null, (err, listings) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({status: 'ok', listings: listings});
        }
    });
});
router.get("/getListingsImgs", (req, res) => {
    ItemListingsModel.find({}, ['images'], null, (err, images) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({status: 'ok', images: images});
        }
    });
});
router.post("/getListingsTextsOfUser", async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({
    email: email
  });
  if (!user) {
    return res.json({status: 'error'});
  }
  const listingIds = user.itemsListed;
  let listingsTexts = await ItemListingsModel.find({'_id': { $in: listingIds} }, ['_id', 'category', 'title', 'deadline', 'description', 'location', 'telegram', 'date', 'listedBy']);
  return res.json({status: 'ok', listingsTexts: listingsTexts});
});
router.post("/getListingsImgsOfUser", async (req, res) => {
  const email = req.body.email;
  const user = await UserModel.findOne({
    email: email
  });
  if (!user) {
    return res.json({status: 'error'});
  }
  const listingIds = user.itemsListed;
  let listingsImgs = await ItemListingsModel.find({'_id': { $in: listingIds} }, ['images']);
  return res.json({status: 'ok', listingsImgs: listingsImgs});
});
router.post("/borrowItem", async (req, res) => {
  const email = req.body.email;
  const itemId = req.body.itemId;
  const user = await UserModel.findOne({
    email: email
  });
  const item = await ItemListingsModel.findOne({_id: itemId});
  if (!user) {
    return res.json({status: 'error', statusCode: 4});
  }
  if (!item) {
    return res.json({status: 'error', statusCode: 3});
  }
  const userId = "" + user._id;
  if (item.borrowedBy) {
    // Item is already borrowed by someone. Major error
    return res.json({status: 'error', statusCode: 1});
  }
  item.borrowedBy = userId;
  item.save();
  let itemsBorrowed = user.itemsBorrowed;
  if (!itemsBorrowed) {
    user.itemsBorrowed = [itemId];
    user.save();
  } else if (!itemsBorrowed.includes(itemId)) {
    itemsBorrowed.push(itemId);
    user.itemsBorrowed = itemsBorrowed;
    user.save();
  } else {
    // This user has already borrowed this item. Major error
    return res.json({status: 'error', statusCode: 2});
  }
  return res.json({status: 'ok', statusCode: 0});
})
router.post("/getBorrowedTextsOfUser", async (req, res) => {
  const userId = req.body.userId;
  const user = await UserModel.findOne({
    _id: userId
  });
  if (!user) {
    return res.json({status: 'error'});
  }
  const borrowedIds = user.itemsBorrowed;
  let borrowedTexts = await ItemListingsModel.find({'_id': { $in: borrowedIds} }, ['_id', 'category', 'title', 'deadline', 'description', 'location', 'telegram', 'date', 'listedBy']);
  return res.json({status: 'ok', borrowedTexts: borrowedTexts});
});
router.post("/getBorrowedImgsOfUser", async (req, res) => {
  const userId = req.body.userId;
  const user = await UserModel.findOne({
    _id: userId
  });
  if (!user) {
    return res.json({status: 'error'});
  }
  const borrowedIds = user.itemsBorrowed;
  let borrowedImgs = await ItemListingsModel.find({'_id': { $in: borrowedIds} }, ['images']);
  return res.json({status: 'ok', borrowedImgs: borrowedImgs});
});

module.exports = router;