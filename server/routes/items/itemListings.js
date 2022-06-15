const express = require("express");
const router = express.Router();
const multer = require("multer");
const ItemListingsModel = require("../../models/ItemListings");

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
      title: request.body.title,
      description: request.body.description,
      location: request.body.location,
      telegram: request.body.telegram,
      date: request.body.date,
      userName: request.body.userName
    };
    ItemListingsModel.create(obj, (err, listing) => {
      if (err) {
        console.log(err);
      } else {
        listing.save();
      }
    });
  
    return response.json({status: 'ok'});
});

module.exports = router;