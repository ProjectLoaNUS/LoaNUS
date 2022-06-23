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
const cors = require("cors");
const { request } = require("http");
const sgMail = require("@sendgrid/mail");
const ejs = require("ejs");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { Router } = require("express");
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
  const givenEmail = req.body.email;
  const user = await UserModel.findOne({
    email: givenEmail,
  });
  if (!user) {
    return res.json({
      status: "ok",
      hasUser: false,
    });
  }
  return res.json({
    status: "ok",
    hasUser: true,
    isVerified: user.isVerified
  });
});

app.post("/api/login", async (req, res) => {
  const signInResultCodes = {
    SUCCESS: 0,
    INVALID_PASSWORD: 1,
    NO_SUCH_USER: 2,
    UNKNOWN: 3,
    EMAIL_NOT_VERIFIED: 4,
  };
  const givenUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (!givenUser.isVerified) {
    return res.json({
      status: "error",
      errorCode: signInResultCodes.EMAIL_NOT_VERIFIED,
      error: `User yet to verify account`,
    });
  }
  if (!givenUser) {
    return res.json({
      status: "error",
      errorCode: signInResultCodes.NO_SUCH_USER,
      error: `User {givenUser.name} doesn't exist`,
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
      return res.json({status: 'ok', user: {
        displayName: givenUser.name,
        age: givenUser.age,
        email: givenUser.email
      }});
    }
    return res.json({
      status: "error",
      errorCode: signInResultCodes.INVALID_PASSWORD,
      error: `Invalid password for {givenUser.name}`,
    });
  });
});

app.post("/api/signUpUser", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  var newUser = new UserModel({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
    password: hashedPassword,
  });
  await newUser.save({}, (err) => {
    if (err) {
      return res.json({ status: "error", error: err });
    }
  });

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
app.post("/api/item-upload", upload.single("image"), (request, response, next) => {
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
});

const items = require("./routes/items/index");
app.use("/api", items);

// Search function

app.get("/search", async (request, response) => {
  try {
    /*var title = ".";
    if (request.query.name) {
      title = request.query.name;
    }
    const agg = [
      {
        $search: {
          autocomplete: {
            query: title,
            path: "name",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          name: 1,
          image: 1,
          desc: 1,
        },
      },
    ];
    const result = await ItemModel.aggregate(agg);
    return response.json(result);
  } catch (error) {
    console.log(error);
    return response.json([]);
  }*/
  /* var collection;
  collection = client.db("loanusdatabase").collection("itemlistings");
  try {
    let result = await collection
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${request.query.title}`,
              path: "title",
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .toArray();
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }*/
  /*try {
    let result = await ItemListingsModel.aggregate([
      {
        $search: {
          autocomplete: {
            query: `${request.query.name}`,
            path: "title",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
    ]);
    response.send(result);
  } catch (error) {
    response.status(500).send({ message: error.message });
  }*/
  
    const ItemListingsModel = require("./models/ItemListings");
    let results;
    if (request.query.name) {
      let resultData;
      if (request.query.isFullSearch) {
        resultData = {
          _id: 0,
          title: 1,
          category: 1,
          description: 1,
          location: 1,
          telegram: 1,
          date: 1,
          userName: 1,
          deadline: 1,
          images: 1
        };
      } else {
        resultData = {
          title: 1,
          _id: 0
        }
      }
      results = await ItemListingsModel.aggregate([
        {
          $search: {
            autocomplete: {
              query: request.query.name,
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
        console.log("Confirmed");
        console.log(results);
        return response.json(results);
      }
    }
    response.json({});
  } catch (error) {
    console.log(error);
    response.json({});
  }
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
