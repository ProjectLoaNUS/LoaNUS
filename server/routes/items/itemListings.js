const itemListings = (socketUtils) => {
  const express = require("express");
  const router = express.Router();
  const multer = require("multer");
  const ItemListingsModel = require("../../models/ItemListings");
  const UserModel = require("../../models/Users");
  const POINTS_SYSTEM = {
    LENT_ITEM: 5,
    ITEM_OVERDUE: -10,
  };

  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fieldsize: 1024 * 1024 * 15 },
  });
  const filesToImgArray = (files) => {
    let data = [];
    let type = [];
    files.forEach((file) => {
      data.push(file.buffer);
      type.push(file.mimetype);
    });
    return {
      data: data,
      contentType: type,
    };
  };
  router.post(
    "/addListing",
    upload.array("images", 4),
    (request, response, next) => {
      if (!request.body.listedBy) {
        return response.json({ status: "error" });
      }
      const owner = JSON.parse(request.body.listedBy);
      const obj = {
        images: filesToImgArray(request.files),
        deadline: request.body.deadline,
        category: request.body.category,
        title: request.body.title,
        description: request.body.description,
        location: request.body.location,
        date: request.body.date,
        listedBy: owner,
      };
      ItemListingsModel.create(obj, (err, listing) => {
        if (err) {
          console.log(err);
        } else {
          listing.save().then((savedListing) => {
            UserModel.findOne(
              {
                _id: owner.id,
              },
              (err, user) => {
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
              }
            );
          });
        }
      });
      return response.json({ status: "ok" });
    }
  );
  router.post("/rmListing", async (request, response) => {
    const itemId = request.body.itemId;
    if (itemId) {
      await ItemListingsModel.deleteOne({ _id: itemId });
      response.json({ status: "ok" });
    } else {
      response.json({ status: "error" });
    }
  });

  router.get("/getListingsTexts", (req, res) => {
    ItemListingsModel.find(
      {},
      [
        "_id",
        "category",
        "title",
        "deadline",
        "description",
        "location",
        "date",
        "listedBy",
        "borrowedBy",
        "borrowRequests"
      ],
      null,
      (err, listings) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({ status: "ok", listings: listings });
        }
      }
    );
  });
  router.get("/getListingsImgs", (req, res) => {
    ItemListingsModel.find({}, ["images"], null, (err, images) => {
      if (err) {
        res.status(500).send("An error occurred", err);
      } else {
        res.json({ status: "ok", images: images });
      }
    });
  });

  router.post("/getListingsTextsOfUser", async (req, res) => {
    if (!req.body.userId) {
      return res.json({ status: "error" });
    }
    const user = await UserModel.findOne({
      _id: req.body.userId,
    });
    if (!user) {
      return res.json({ status: "error" });
    }
    const listingIds = user.itemsListed;
    let listingsTexts = await ItemListingsModel.find(
      { _id: { $in: listingIds } },
      [
        "_id",
        "category",
        "title",
        "deadline",
        "description",
        "location",
        "date",
        "listedBy",
        "borrowRequests"
      ]
    );
    return res.json({ status: "ok", listingsTexts: listingsTexts });
  });
  router.post("/getListingsImgsOfUser", async (req, res) => {
    if (!req.body.userId) {
      return res.json({ status: "error" });
    }
    const user = await UserModel.findOne({
      _id: req.body.userId,
    });
    if (!user) {
      return res.json({ status: "error" });
    }
    const listingIds = user.itemsListed;
    let listingsImgs = await ItemListingsModel.find(
      { _id: { $in: listingIds } },
      ["images"]
    );
    return res.json({ status: "ok", listingsImgs: listingsImgs });
  });

  router.post("/getBorrowRequestUsers", async (req, res) => {
    const itemId = req.body.itemId;
    if (!itemId) {
      return res.json({status: 'error'});
    }
    const item = await ItemListingsModel.findOne({ _id: itemId });
    if (!item) {
      return res.json({status: 'error'});
    }
    const userIds = item.borrowRequests;
    return res.json({status: 'ok', userIds: userIds});
  });

  router.post("/requestBorrowItem", async (req, res) => {
    const REQ_BORROW_RES_CODES = {
      SUCCESS: 0,
      BORROWED_BY_ANOTHER: 1,
      ALR_REQ_BY_U: 2,
      NO_SUCH_ITEM: 3,
      NO_SUCH_USER: 4,
      NO_SUCH_OWNER: 5
    };
    const userId = req.body.userId;
    const itemId = req.body.itemId;
    if (!userId) {
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.NO_SUCH_USER });
    }
    if (!itemId) {
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    const user = await UserModel.findOne({
      _id: userId,
    });
    const item = await ItemListingsModel.findOne({ _id: itemId });
    if (!user) {
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.NO_SUCH_USER });
    }
    if (!item) {
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    if (item.borrowedBy) {
      // Item is already borrowed by someone. Major error
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.BORROWED_BY_ANOTHER });
    }
    const owner = item.listedBy;
    if (!owner) {
      // Cannot identify the item owner
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.NO_SUCH_OWNER });
    }
    item.borrowRequests.push(userId);
    item.save();
    let itemBorrowRequests = user.itemBorrowRequests;
    if (!itemBorrowRequests) {
      user.itemBorrowRequests = [itemId];
      user.save();
    } else if (!itemBorrowRequests.includes(itemId)) {
      itemBorrowRequests.push(itemId);
      user.itemBorrowRequests = itemBorrowRequests;
      user.save();
    } else {
      // This user has already requested to borrow this item. Major error
      return res.json({ status: "error", statusCode: REQ_BORROW_RES_CODES.ALR_REQ_BY_U });
    }
    socketUtils.notify(null, owner.id, "New request to borrow your item", "/profile");
    return res.json({ status: "ok", statusCode: REQ_BORROW_RES_CODES.SUCCESS });
  });

  const rmBorrowRequests = async (userIds, itemId) => {
    if (userIds && itemId) {
      userIds.forEach(userId => {
        UserModel.findOneAndUpdate({
          _id: userId
        }, {
          $pull: { itemBorrowRequests: itemId }
        }).exec();
      });
    } else if (!userIds) {
      console.log(`rmBorrowRequests: Invalid user IDs given`);
    } else if (!itemId) {
      console.log(`rmBorrowRequests: Invalid item ID given`);
    }
  }
  router.post("/approveBorrowItem", async (req, res) => {
    const BORROW_RES_CODES = {
      SUCCESS: 0,
      BORROWED_BY_ANOTHER: 1,
      ALR_BORROWED_BY_U: 2,
      NO_SUCH_ITEM: 3,
      NO_SUCH_USER: 4
    };
    const userId = req.body.userId;
    const itemId = req.body.itemId;
    if (!userId) {
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.NO_SUCH_USER });
    }
    if (!itemId) {
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    const user = await UserModel.findOne({
      _id: userId,
    });
    const item = await ItemListingsModel.findOne({ _id: itemId });
    if (!user) {
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.NO_SUCH_USER });
    }
    if (!item) {
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    if (item.borrowedBy) {
      // Item is already borrowed by someone. Major error
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.BORROWED_BY_ANOTHER });
    }
    item.borrowedBy = userId;
    // Clear all borrow requests from other users
    const requestUsers = item.borrowRequests;
    rmBorrowRequests(requestUsers, itemId);
    item.borrowRequests = undefined;
    item.save();
    socketUtils.notify(null, "" + user._id,
        `Borrow request for item "${item.title}" approved`, "");
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
      return res.json({ status: "error", statusCode: BORROW_RES_CODES.ALR_BORROWED_BY_U });
    }
    return res.json({ status: "ok", statusCode: BORROW_RES_CODES.SUCCESS });
  });

  router.post("/denyBorrowItem", async (req, res) => {
    const DENY_BORROW_RES_CODES = {
      SUCCESS: 0,
      NO_SUCH_USER: 1,
      NO_SUCH_ITEM: 2
    }
    const userId = req.body.userId;
    const itemId = req.body.itemId;
    if (!userId) {
      return res.json({status: 'error', statusCode: DENY_BORROW_RES_CODES.NO_SUCH_USER});
    }
    if (!itemId) {
      return res.json({status: 'error', statusCode: DENY_BORROW_RES_CODES.NO_SUCH_ITEM});
    }
    rmBorrowRequests([userId], itemId);
    const item = await ItemListingsModel.findOne({ _id: itemId });
    if (!item) {
      return res.json({status: 'error', statusCode: DENY_BORROW_RES_CODES.NO_SUCH_ITEM});
    }
    item.borrowRequests = item.borrowRequests.filter(requestId => requestId !== userId);
    UserModel.findOne({ _id: userId })
      .then(user => {
        socketUtils.notify(null, "" + user._id,
            `Borrow request for item "${item.title}" rejected`, "");
      });
    await item.save();
    return res.json({status: 'ok', statusCode: DENY_BORROW_RES_CODES.SUCCESS});
  });

  router.post("/getBorrowedTextsOfUser", async (req, res) => {
    const userId = req.body.userId;
    const user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res.json({ status: "error" });
    }
    const borrowedIds = user.itemsBorrowed;
    let borrowedTexts = await ItemListingsModel.find(
      { _id: { $in: borrowedIds } },
      [
        "_id",
        "category",
        "title",
        "deadline",
        "description",
        "location",
        "date",
        "listedBy",
      ]
    );
    return res.json({ status: "ok", borrowedTexts: borrowedTexts });
  });
  router.post("/getBorrowedImgsOfUser", async (req, res) => {
    const userId = req.body.userId;
    const user = await UserModel.findOne({
      _id: userId,
    });
    if (!user) {
      return res.json({ status: "error" });
    }
    const borrowedIds = user.itemsBorrowed;
    let borrowedImgs = await ItemListingsModel.find(
      { _id: { $in: borrowedIds } },
      ["images"]
    );
    return res.json({ status: "ok", borrowedImgs: borrowedImgs });
  });

  router.post("/returnItem", async (req, res) => {
    const RETURN_STATUS_CODES = {
      SUCCESS: 0,
      NO_SUCH_USER: 1,
      NO_SUCH_ITEM: 2,
      ITEM_NOT_LENT: 3,
      WRONG_USER: 4,
      WRONG_ITEM: 5,
      UNKNOWN_OWNER: 6,
    };

    const userId = req.body.userId;
    const itemId = req.body.itemId;
    if (!userId) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.NO_SUCH_USER,
      });
    }
    if (!itemId) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.NO_SUCH_ITEM,
      });
    }

    const user = await UserModel.findOne({
      _id: userId,
    });
    const item = await ItemListingsModel.findOne({ _id: itemId });
    if (!user) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.NO_SUCH_USER,
      });
    }
    if (!item) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.NO_SUCH_ITEM,
      });
    }

    const owner = await UserModel.findOne({ _id: item.listedBy.id });
    if (!owner) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.UNKNOWN_OWNER,
      });
    }
    if (!item.borrowedBy) {
      // Item is not marked as borrowed by anyone. Major error
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.ITEM_NOT_LENT,
      });
    }
    if (item.borrowedBy !== userId) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.WRONG_USER,
      });
    }

    const itemIndex = user.itemsBorrowed.indexOf(itemId);
    if (itemIndex === -1) {
      return res.json({
        status: "error",
        statusCode: RETURN_STATUS_CODES.WRONG_ITEM,
      });
    }

    const deadline = new Date(item.deadline);
    deadline.setHours(0, 0, 0, 0);
    const dateNow = new Date();
    dateNow.setHours(0, 0, 0, 0);
    if (dateNow > deadline) {
      const newPoints = user.points + POINTS_SYSTEM.ITEM_OVERDUE;
      user.points = newPoints;
    }
    const newPoints = owner.points + POINTS_SYSTEM.LENT_ITEM;
    owner.points = newPoints;
    user.itemsBorrowed.splice(itemIndex, 1);
    item.borrowedBy = undefined;
  
    socketUtils.notify(null, "" + owner._id, `Item "${item.title}" returned by "${user.name}"`, "/profile");

    owner.save();
    user.save();
    item.save();

    return res.json({ status: "ok", statusCode: RETURN_STATUS_CODES.SUCCESS });
  });

  // get category texts
  router.get("/getCategoryListingsTexts", (req, res) => {
    ItemListingsModel.find(
      { category: req.query.category },
      [
        "_id",
        "category",
        "title",
        "deadline",
        "description",
        "location",
        "date",
        "listedBy",
        "borrowedBy",
      ],
      null,
      (err, listings) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({ status: "ok", listings: listings });
        }
      }
    );
  });
  //get category image
  router.get("/getCategoryListingsImgs", (req, res) => {
    ItemListingsModel.find(
      { category: req.query.category },
      ["images"],
      null,
      (err, images) => {
        if (err) {
          res.status(500).send("An error occurred", err);
        } else {
          res.json({ status: "ok", images: images });
        }
      }
    );
  });

  //get recommendation listings
  router.get("/getRecommendationTexts", (req, res) => {
    const category = req.query.category;
    ItemListingsModel.find(
      { category: category },
      [
        "_id",
        "category",
        "title",
        "deadline",
        "description",
        "location",
        "date",
        "listedBy",
        "borrowedBy",
      ],
      null,
      (err, listings) => {
        if (err) {
          res.json({ status: "error occured" });
        } else {
          res.json({ status: "ok", listings: listings });
        }
      }
    );
  });
  router.get("/getRecommendationImgs", (req, res) => {
    const category = req.query.category;
    ItemListingsModel.find(
      { category: category },
      ["images"],
      null,
      (err, images) => {
        if (err) {
          res.json({ status: "error occured" });
        } else {
          res.json({ status: "ok", images: images });
        }
      }
    );
  });

  return router;
}

module.exports = itemListings;
