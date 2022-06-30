const express = require("express");
//const { MongoClient } = require("mongodb");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const UserModel = require("./models/Users");
const ItemModel = require("./models/Items");
const ItemListingsModel = require("./models/ItemListings");
const cors = require("cors");
const { request } = require("http");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Router, response } = require("express");
const PORT = process.env.PORT || 3001;

require("dotenv").config();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.json());
//const client = new MongoClient(
// "mongodb+srv://loanus123:loanushyyb123@loanus-database.csjkq.mongodb.net/loanusdatabase?retryWrites=true&w=majority"
//);
//client.connect();
app.use(cors());

mongoose.connect(
  "mongodb+srv://loanus123:loanushyyb123@loanus-database.csjkq.mongodb.net/loanusdatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

sgMail.setApiKey(process.env.API_KEY);

app.post("/api/hasUser", async (req, res) => {
  const hasUserResultCodes = {
    HAS_USER: 0,
    NO_SUCH_USER: 1,
    UNVERIFIED_USER: 2,
    UNKNOWN_ERROR: 3,
    ALTERNATE_SIGN_IN: 4
  };
  const givenEmail = req.body.email;
  const user = await UserModel.findOne({
    $and: [
      { email: givenEmail },
      { password: { $exists: true} }
  ]});
  if (!user) {
    const thirdPartyUser = await UserModel.findOne({
      $and: [
        { email: givenEmail },
        { password: { $exists: false} }
    ]});
    if (thirdPartyUser) {
      return res.json({
        status: "error",
        statusCode: hasUserResultCodes.ALTERNATE_SIGN_IN
      });
    }
    return res.json({
      status: "ok",
      hasUser: false,
    });
  }
  return res.json({
    status: "ok",
    hasUser: true,
    isVerified: user.isVerified,
  });
});

app.post("/api/login", async (req, res) => {
  const signInResultCodes = {
    SUCCESS: 0,
    INVALID_PASSWORD: 1,
    NO_SUCH_USER: 2,
    UNKNOWN: 3,
    EMAIL_NOT_VERIFIED: 4,
    ALTERNATE_SIGN_IN: 5
  };
  const givenUser = await UserModel.findOne({
    $and: [
      { email: req.body.email },
      { password: { $exists: true} }
  ]});
  if (!givenUser) {
    return res.json({
      status: "error",
      errorCode: signInResultCodes.NO_SUCH_USER,
      error: `User doesn't exist`,
    });
  }
  if (!givenUser.password) {
    return res.json({
      status: "error",
      errorCode: signInResultCodes.ALTERNATE_SIGN_IN,
      error: `User account uses 3rd party log in method`,
    });
  }
  if (!givenUser.isVerified) {
    return res.json({
      status: "error",
      errorCode: signInResultCodes.EMAIL_NOT_VERIFIED,
      error: `User yet to verify account`,
    });
  }
  await bcrypt.compare(req.body.password, givenUser.password, (err, result) => {
    if (err) {
      return res.json({
        status: "error",
        errorCode: signInResultCodes.UNKNOWN,
        error: err,
      });
    }
    if (result) {
      return res.json({
        status: "ok",
        user: {
          id: "" + givenUser._id,
          displayName: givenUser.name,
          age: givenUser.age,
          email: givenUser.email,
          photodata: givenUser.image.data,
          photoformat: givenUser.image.contentType,
        },
      });
    }
    return res.json({
      status: "error",
      errorCode: signInResultCodes.INVALID_PASSWORD,
      error: `Invalid password for {givenUser.name}`,
    });
  });
});

app.post("/api/signUpUser", async (req, res) => {
  const newUser = await UserModel.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    points: 0
  });
  const password = req.body.password;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser.password = hashedPassword;
    newUser.emailToken = crypto.randomBytes(64).toString("hex");
    newUser.isVerified = false;
  } else {
    newUser.emailToken = null;
    newUser.isVerified = true;
  }
  await newUser.save({}, (err) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }
  });

  if (password) {  
    const msg = {
      to: req.body.email,
      from: "yongbin0162@gmail.com",
      subject: "LoaNUS - Verify your email",
      text: `Thanks for signing up for our site! Please copy and paste the address to verify your account. http://${req.headers.host}/verify-email?token=${newUser.emailToken}`,
      html: `<h1>Hello,</h1>
      <p>Thanks for registering on our app.</p>
      <p>Please click the link below to verify your account.</p>
      <a href="http://${req.headers.host}/verify-email?token=${newUser.emailToken}">Verify your account</a>`,
    };

    sgMail.send(msg, function (err, info) {
      if (err) {
        console.log("Email Not Sent");
      } else {
        console.log("Email Sent Success");
      }
    });
  }
  return res.json({ status: "ok" });
});

// Email verification route
app.get("/verify-email", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ emailToken: req.query.token });
    if (!user) {
      console.log("error", "Token is invalid");
    }
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
  } catch (error) {
    console.log(error);
  }
  res.render("verify-email");
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 3 },
});
app.get("/api/getItemTexts", (req, res) => {
  ItemModel.find({}, ["name", "desc"], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.get("/api/getItemImages", (req, res) => {
  ItemModel.find({}, ["image"], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.post(
  "/api/item-upload",
  upload.single("image"),
  (request, response, next) => {
    const obj = {
      name: request.body.name,
      desc: request.body.description,
      image: {
        data: request.file.buffer,
        contentType: request.file.mimetype,
      },
    };
    ItemModel.create(obj, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        item.save();
      }
    });
    response.send("Upload success");
  }
);

//Upload profile picture
app.post(
  "/profile-upload",
  upload.single("image"),
  (request, response, next) => {
    try {
      UserModel.findOne({ name: request.body.username }, function (err, User) {
        if (!User) {
          console.log("error", "User not found");
        }
        const imageprop = {
          data: request.file.buffer,
          contentType: request.file.mimetype,
        };

        User.image = imageprop;
        User.save();
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const items = require("./routes/items/index");

app.use("/api", items);

// Search function
app.get("/api/search", async (request, response) => {
  try {
    const query = request.query;
    let results;
    if (query.name) {
      let resultData;
      if (query.isFullSearch === "true") {
        if (query.isImageOnly === "true") {
          resultData = {
            images: 1
          };
        } else if (query.isTextOnly === "true") {
          resultData = {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            telegram: 1,
            date: 1,
            listedBy: 1,
            deadline: 1,
            borrowedBy: 1
          };
        } else {
          resultData = {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            location: 1,
            telegram: 1,
            date: 1,
            listedBy: 1,
            deadline: 1,
            images: 1,
            borrowedBy: 1
          };
        }
      } else {
        resultData = {
          title: 1,
          borrowedBy: 1,
          _id: 1
        }
      }
      results = await ItemListingsModel.aggregate([
        {
          $search: {
            index: "listings",
            autocomplete: {
              query: `${query.name}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
              tokenOrder: "sequential",
            },
          },
        },
        {
          $limit: 15,
        },
        {
          $project: resultData
        },
      ]);
      if (results) {
        return response.json({status: 'ok', results: results});
      }
    }
    response.json({status: 'error'});
  } catch (error) {
    console.log(error);
    response.json({status: 'error'});
  }
});
// Search function
app.get("/api/search-exact", async (request, response) => {
  try {
    const query = request.query;
    if (!query.id) {
      return response.json({status: 'error'});
    }
    const result = await ItemListingsModel.findOne({
      _id: query.id,
    });
    if (result) {
      return response.json({status: 'ok', result: result});
    }
    response.json({status: 'error'});
  } catch (error) {
    console.log(error);
    response.json({status: 'error'});
  }
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
