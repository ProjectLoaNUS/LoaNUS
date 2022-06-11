const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const UserModel = require("./models/Users");
const ItemModel = require("./models/Items");
const cors = require("cors");
const { request } = require("http");
const bcrypt = require('bcryptjs');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
mongoose.connect(
  "mongodb+srv://loanus123:loanushyyb123@loanus-database.csjkq.mongodb.net/loanusdatabase?retryWrites=true&w=majority"
);

app.post("/api/hasUser", async (req, res) => {
  const givenEmail = req.body.email;
  const user = await UserModel.findOne({
    email: givenEmail
  });
  if (!user) {
    return res.json({
      status: 'ok',
      hasUser: false
    });
  }
  return res.json({
    status: 'ok',
    hasUser: true
  });
});

app.post("/api/login", async (req, res) => {
  const signInResultCodes = {
    SUCCESS: 0,
    INVALID_PASSWORD: 1,
    NO_SUCH_USER: 2,
    UNKNOWN: 3
  }
  const givenUser = await UserModel.findOne({
    email: req.body.email
  });
  if (!givenUser) {
    return res.json({status: 'error', errorCode: signInResultCodes.NO_SUCH_USER, error: `User {givenUser.name} doesn't exist`});
  }
  await bcrypt.compare(req.body.password, givenUser.password, (err, result) => {
    if (err) {
      return res.json({status: 'error', errorCode: signInResultCodes.UNKNOWN, error: err});
    }
    if (result) {
      return res.json({status: 'ok', user: givenUser});
    }
    return res.json({status: 'error', errorCode: signInResultCodes.INVALID_PASSWORD, error: `Invalid password for {givenUser.name}`});
  });
});

app.post("/api/signUpUser", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await UserModel.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email,
    password: hashedPassword
  }, (err) => {
    if (err) {
      return res.json({status: 'error', error: err});
    }
  })
  return res.json({status: 'ok'});
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 3 },
});
app.get("/api/getItemTexts", (req, res) => {
  ItemModel.find({}, ['name', 'desc'], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.get("/api/getItemImages", (req, res) => {
  ItemModel.find({}, ['image'], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.post("/api/item-upload", upload.single("image"), (request, response, next) => {
  console.log(request.file);
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

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
