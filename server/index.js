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

app.post("/hasUser", async (req, res) => {
  const givenUsername = req.body.username;
  const user = await UserModel.findOne({
    username: givenUsername
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

app.post("/login", async (req, res) => {
  const givenUser = await UserModel.findOne({
    username: req.body.username
  });
  if (!givenUser) {
    return res.json({status: 'error', error: 'No such user'});
  }
  await bcrypt.compare(req.body.password, givenUser.password, (err, result) => {
    if (err) {
      return res.json({status: 'error', error: err});
    }
    if (result) {
      console.log('success');
      return res.json({status: 'ok', user: givenUser});
    }
    return res.json({status: 'error', error: `Invalid password for {givenUser.username}`});
  });
});

app.post("/signUpUser", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await UserModel.create({
    name: req.body.name,
    age: req.body.age,
    username: req.body.username,
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
app.get("/getItemTexts", (req, res) => {
  ItemModel.find({}, ['name', 'desc'], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.get("/getItemImages", (req, res) => {
  ItemModel.find({}, ['image'], null, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json(items);
    }
  });
});
app.post("/item-upload", upload.single("image"), (request, response, next) => {
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
