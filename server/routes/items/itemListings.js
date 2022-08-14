const itemListings = (socketUtils) => {
  const express = require("express");
  const router = express.Router();
  const multer = require("multer");
  const ItemListingsModel = require("../../models/ItemListings");
  const UserModel = require("../../models/Users");
  const auth = require("../../utils/auth");
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

  const findMatchingRequests = async (listing) => {
    const listingId = "" + listing._id;
    const listingTitle = listing.title;
    const listingDesc = listing.description;
    const owner = listing.listedBy;
    if (listingTitle) {
      const ItemRequestsModel = require("../../models/ItemRequests");
      const resultData = {
        _id: 1,
        category: 1
      };
      let results = await ItemRequestsModel.aggregate([
        {
          $search: {
            index: "requests",
            text: {
              query: [listingTitle, listingDesc],
              path: ["title"]
            }
          },
        },
        {
          $limit: 15,
        },
        {
          $project: resultData,
        },
      ]);
      if (results?.length) {
        results.forEach(req => {
          // Matching listing must be the same category as item request
          if (req.category === listing.category) {
            const requestId = "" + req._id;
            ItemRequestsModel.findOne({ _id: requestId })
              .then(request => {
                const reqOwnerId = request.listedBy.id;
                // Matching listing is created by another user
                if (reqOwnerId !== owner.id) {
                  // Notify user who made the request that a potential match was found
                  socketUtils.notify(null, reqOwnerId,
                      `New match for your request ${request.title}`, "/profile/requests");
                }
                const matchingListings = request.matchingListings;
                if (matchingListings && !matchingListings.includes(listingId)) {
                  matchingListings.push(listingId);
                  request.save();
                } else if (!matchingListings) {
                  matchingListings = [listingId];
                  request.save();
                }
              });
          }
        });
      }
    } else {
      console.log("Invalid listing title passed to findMatchingRequests()");
    }
  };
  router.post(
    "/addListing",
    upload.array("images", 4),
    async (request, response) => {
      if (!request.user || !request.user.id) {
        return response.status(401).json({ error: "JWT User ID is missing" });
      }
      const userId = request.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return response.status(403).json({ error: "JWT User ID is invalid" });
      }
      if (!request.body.listedBy) {
        return response.status(400).json({ error: "Missing owner details for item listing" });
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
            let itemsListed = user.itemsListed;
            const listingId = "" + savedListing._id;
            findMatchingRequests(savedListing);
            if (!itemsListed) {
              user.itemsListed = [listingId];
              user.save();
            } else if (!itemsListed.includes(listingId)) {
              itemsListed.push(listingId);
              user.itemsListed = itemsListed;
              user.save();
            }
          });
        }
      });
      return response.status(200);
    }
  );
  router.post("/rmListing", async (request, response) => {
    if (!request.user || !request.user.id) {
      return response.status(401).json({ error: "JWT User ID is missing" });
    }
    const userId = request.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return response.status(403).json({ error: "JWT User ID is invalid" });
    }
    const itemId = request.body.itemId;
    if (itemId) {
      await ItemListingsModel.deleteOne({ _id: itemId });
      response.status(200);
    } else {
      response.status(400).json({ error: "Missing ID of item listing to delete" });
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
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ listings: listings });
        }
      }
    );
  });
  router.get("/getListingsImgs", (req, res) => {
    ItemListingsModel.find({}, ["images"], null, (err, images) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({ images: images });
      }
    });
  });

  const getTheseListingsTexts = async (listingIds) => {
    const listingsTexts = await ItemListingsModel.find(
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
    return listingsTexts;
  };
  router.get("/getListingsTextsOfUser", async (req, res) => {
    if (!req.user.id) {
      return res.status(401).json({ error: "JWT User ID is missing" });
    }
    const user = await auth.getUser(req.user.id);
    if (!user) {
      return res.status(403).json({ error: "JWT User ID is invalid" });
    }
    const listingIds = user.itemsListed;
    let listingsTexts = await getTheseListingsTexts(listingIds);
    return res.status(200).json({ listingsTexts: listingsTexts });
  });
  const getTheseListingsImgs = async (listingIds) => {
    const listingsImgs = await ItemListingsModel.find(
      { _id: { $in: listingIds } },
      ["images"]
    );
    return listingsImgs;
  };
  router.get("/getListingsImgsOfUser", async (req, res) => {
    if (!req.user.id) {
      return res.status(401).json({ error: "JWT User ID is missing" });
    }
    const user = await auth.getUser(req.user.id);
    if (!user) {
      return res.status(403).json({ error: "JWT User ID is invalid" });
    }
    const listingIds = user.itemsListed;
    let listingsImgs = await getTheseListingsImgs(listingIds);
    return res.status(200).json({ listingsImgs: listingsImgs });
  });

  router.post("/getTheseListingsTexts", async (req, res) => {
    const listingIds = req.body.listingIds;
    if (!listingIds) {
      return res.status(400).json({ error: "Invalid item listing ID provided" });
    }
    let listingsData;
    try {
      listingsData = await getTheseListingsTexts(listingIds);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ listingsData: listingsData});
  });
  router.post("/getTheseListingsImgs", async (req, res) => {
    const listingIds = req.body.listingIds;
    if (!listingIds) {
      return res.status(400).json({ error: "ID(s) for item listings to find in database missing" });
    }
    let listingsImgs;
    try {
      listingsImgs = await getTheseListingsImgs(listingIds);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ listingsImgs: listingsImgs });
  });

  router.post("/getBorrowRequestUsers", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({error: "Item ID not provided"});
    }
    const item = await ItemListingsModel.findById(itemId);
    if (!item) {
      return res.status(500).json({error: "Unable to find item in database"});
    }
    const userIds = item.borrowRequests;
    return res.status(200).json({ userIds: userIds});
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ errorCode: REQ_BORROW_RES_CODES.NO_SUCH_USER });
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({ errorCode: REQ_BORROW_RES_CODES.NO_SUCH_USER });
    }

    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ errorCode: REQ_BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    const item = await ItemListingsModel.findById(itemId);
    if (!item) {
      return res.status(400).json({ errorCode: REQ_BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    if (item.borrowedBy) {
      // Item is already borrowed by someone. Major error
      return res.status(400).json({ errorCode: REQ_BORROW_RES_CODES.BORROWED_BY_ANOTHER });
    }
    const owner = item.listedBy;
    if (!owner) {
      // Cannot identify the item owner
      return res.status(400).json({ errorCode: REQ_BORROW_RES_CODES.NO_SUCH_OWNER });
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
      return res.status(400).json({ errorCode: REQ_BORROW_RES_CODES.ALR_REQ_BY_U });
    }
    socketUtils.notify(null, owner.id, "New request to borrow your item", "/profile");
    return res.status(200);
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ errorCode: BORROW_RES_CODES.NO_SUCH_USER });
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({ errorCode: BORROW_RES_CODES.NO_SUCH_USER });
    }
    
    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({ errorCode: BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    const item = await ItemListingsModel.findById(itemId);
    if (!item) {
      return res.status(400).json({ errorCode: BORROW_RES_CODES.NO_SUCH_ITEM });
    }
    if (item.borrowedBy) {
      // Item is already borrowed by someone. Major error
      return res.status(400).json({ errorCode: BORROW_RES_CODES.BORROWED_BY_ANOTHER });
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
      return res.status(400).json({ errorCode: BORROW_RES_CODES.ALR_BORROWED_BY_U });
    }
    return res.status(200);
  });

  router.post("/denyBorrowItem", async (req, res) => {
    const DENY_BORROW_RES_CODES = {
      SUCCESS: 0,
      NO_SUCH_USER: 1,
      NO_SUCH_ITEM: 2
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({errorCode: DENY_BORROW_RES_CODES.NO_SUCH_USER});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({errorCode: DENY_BORROW_RES_CODES.NO_SUCH_USER});
    }
    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({errorCode: DENY_BORROW_RES_CODES.NO_SUCH_ITEM});
    }
    rmBorrowRequests([userId], itemId);
    const item = await ItemListingsModel.findById(itemId);
    if (!item) {
      return res.status(400).json({errorCode: DENY_BORROW_RES_CODES.NO_SUCH_ITEM});
    }
    item.borrowRequests = item.borrowRequests.filter(requestId => requestId !== userId);
    socketUtils.notify(null, "" + userId,
        `Borrow request for item "${item.title}" rejected`, "");
    await item.save();
    return res.status(200);
  });

  router.get("/getBorrowedTextsOfUser", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "JWT User ID is missing" });
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({ error: "JWT User ID is invalid" });
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
    return res.status(200).json({ borrowedTexts: borrowedTexts });
  });
  router.get("/getBorrowedImgsOfUser", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "JWT User ID is missing" });
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({ error: "JWT User ID is invalid" });
    }
    const borrowedIds = user.itemsBorrowed;
    let borrowedImgs = await ItemListingsModel.find(
      { _id: { $in: borrowedIds } },
      ["images"]
    );
    return res.status(200);
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

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        errorCode: RETURN_STATUS_CODES.NO_SUCH_USER,
      });
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(403).json({
        errorCode: RETURN_STATUS_CODES.NO_SUCH_USER,
      });
    }

    const itemId = req.body.itemId;
    if (!itemId) {
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.NO_SUCH_ITEM,
      });
    }
    const item = await ItemListingsModel.findById(itemId);
    if (!item) {
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.NO_SUCH_ITEM,
      });
    }

    const owner = await UserModel.findById(item.listedBy.id);
    if (!owner) {
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.UNKNOWN_OWNER,
      });
    }
    if (!item.borrowedBy) {
      // Item is not marked as borrowed by anyone. Major error
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.ITEM_NOT_LENT,
      });
    }
    if (item.borrowedBy !== userId) {
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.WRONG_USER,
      });
    }

    const itemIndex = user.itemsBorrowed.indexOf(itemId);
    if (itemIndex === -1) {
      return res.status(400).json({
        errorCode: RETURN_STATUS_CODES.WRONG_ITEM,
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

    return res.status(200);
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
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ listings: listings });
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
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ images: images });
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
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ listings: listings });
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
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({ images: images });
        }
      }
    );
  });

  return router;
}

module.exports = itemListings;
