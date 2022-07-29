const express = require("express");
const router = express.Router();
const UserModel = require("../models/Users");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer");

sgMail.setApiKey(process.env.API_KEY);

const getThirdPartyUser = async (email) => {
  const user = await UserModel.findOne({
    $and: [{ email: email }, { password: { $exists: false } }],
  });
  return user;
};
const isThirdPartyUser = async (email) => {
  const user = await getThirdPartyUser(email);
  return !!user;
};
router.post("/hasUser", async (req, res) => {
  const hasUserResultCodes = {
    HAS_USER: 0,
    NO_SUCH_USER: 1,
    UNVERIFIED_USER: 2,
    UNKNOWN_ERROR: 3,
    ALTERNATE_SIGN_IN: 4,
  };
  const givenEmail = req.body.email;
  const user = await UserModel.findOne({
    $and: [{ email: givenEmail }, { password: { $exists: true } }],
  });
  if (!user) {
    const isUserThirdParty = await isThirdPartyUser(givenEmail);
    if (isUserThirdParty) {
      return res.json({
        status: "error",
        statusCode: hasUserResultCodes.ALTERNATE_SIGN_IN,
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

router.post("/login", async (req, res) => {
  const signInResultCodes = {
    SUCCESS: 0,
    INVALID_PASSWORD: 1,
    NO_SUCH_USER: 2,
    UNKNOWN: 3,
    EMAIL_NOT_VERIFIED: 4,
    ALTERNATE_SIGN_IN: 5,
  };
  const givenUser = await UserModel.findOne({
    $and: [{ email: req.body.email }, { password: { $exists: true } }],
  });
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
          followers: givenUser.followers,
          following: givenUser.following,
          admin: givenUser.admin,
          createdat: givenUser.createdAt,
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
router.post("/postAltLogin", async (req, res) => {
  const email = req.body.email;
  let user;
  user = await getThirdPartyUser(email);
  if (user) {
    const userId = "" + user._id;
    let trimmedUser = {
      id: userId,
      displayName: user.name,
      age: user.age,
      email: user.email,
    };
    if ((!user.image || !user.image.url) && req.body.photoURL) {
      const image = {
        url: req.body.photoURL,
      };
      UserModel.findByIdAndUpdate({ _id: userId }, { image: image });
    }
    return res.json({ status: "ok", user: trimmedUser });
  } else {
    user = await UserModel.create({
      name: req.body.name,
      age: req.body.age,
      email: email,
      image: {
        url: req.body.photoURL,
      },
      points: 0,
      admin: false,
      emailToken: null,
      isVerified: true,
    });
    await user.save({}, (err) => {
      if (err) {
        return res.json({ status: "error", error: err });
      }
    });
    let trimmedUser = {
      id: "" + user._id,
      displayName: user.name,
      age: user.age,
      email: user.email,
    };
    return res.json({ status: "ok", user: trimmedUser });
  }
});

router.post("/signUp", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  if (!password) {
    return res.json({ status: "error" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    name: req.body.name,
    age: req.body.age,
    email: email,
    points: 0,
    password: hashedPassword,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
    recommendation: [],
    admin: false,
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
    text: `Thanks for signing up for our site! Please copy and paste the address to verify your account. ${
      req.protocol
    }://${req.get("host")}/api/user/verifyEmail?token=${newUser.emailToken}`,
    html: `<h1>Hello,</h1>
    <p>Thanks for registering on our app.</p>
    <p>Please click the link below to verify your account.</p>
    <a href="${req.protocol}://${req.get("host")}/api/user/verifyEmail?token=${
      newUser.emailToken
    }">Verify your account</a>`,
  };

  sgMail.send(msg, function (err, info) {
    if (err) {
      console.log("Email Not Sent");
    }
  });
  return res.json({ status: "ok" });
});
// Get personal details of one user
router.get("/getUserDetails", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await UserModel.findById(userId)
      : await UserModel.findOne({ name: username });
    res.json({
      user: {
        displayName: user.name,
        age: user.age,
        email: user.email,
        photodata: user.image.data,
        photoformat: user.image.contentType,
        id: user._id,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
//get all users
router.get("/getAllUsers", async (req, res) => {
  try {
    const filter = {};
    const all = await UserModel.find(filter);
    res.json(all);
  } catch (err) {
    console.log(err);
  }
});
router.post("/getNamesOf", async (req, res) => {
  const users = req.body.users;
  if (!users) {
    return res.json({ status: "error" });
  }
  const userDetails = await UserModel.find(
    { _id: { $in: users.map((user) => user.userId) } },
    ["_id", "name"]
  );
  return res.json({ status: "ok", userDetails: userDetails });
});

// Email verification route
router.get("/verifyEmail", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ emailToken: req.query.token });
    if (!user) {
      console.log("error", "Token is invalid");
    }
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    return res.render("verifyEmail");
  } catch (error) {
    console.log(error);
    return res.render("verifyEmailError");
  }
});

router.post("/getProfilePic", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.json({ status: "error" });
  }
  const user = await UserModel.findOne({ _id: userId }, ["image"]);
  if (!user) {
    return res.json({ status: "error" });
  }
  return res.json({ status: "ok", image: user.image });
});

//Upload profile picture
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 3 },
});
router.post("/setProfilePic", upload.single("image"), (request, response) => {
  try {
    UserModel.findOne({ _id: request.body.userId }, function (err, User) {
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
});

router.post("/getPoints", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.json({ status: "error" });
  }
  const user = await UserModel.findOne({ _id: userId }, ["points"]);
  if (!user) {
    return res.json({ status: "error" });
  }
  return res.json({ status: "ok", points: user.points });
});

//UserSearch
router.get("/search", async (request, response) => {
  try {
    const query = request.query;
    let results;

    results = await UserModel.aggregate([
      {
        $search: {
          index: "users",
          autocomplete: {
            query: `${query.name}`,
            path: "name",
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
        $project: {
          _id: 1,
          name: 1,
          image: 1,
        },
      },
    ]);
    if (results) {
      return response.json({ status: "ok", results: results });
    }

    response.json({ status: "error" });
  } catch (error) {
    console.log(error);
    response.json({ status: "error" });
  }
});
router.post("/getFollowersCount", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.json({ status: "error" });
    }
    const user = await UserModel.findOne({ _id: userId }, ["followers"]);
    if (!user) {
      return res.json({ status: "error" });
    }
    const followersCount = user.followers?.length || 0;
    return res.json({ status: "ok", followersCount: followersCount });
  } catch (err) {
    console.log(err);
  }
});
router.post("/getFollowingCount", async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.json({ status: "error" });
    }
    const user = await UserModel.findOne({ _id: userId }, ["following"]);
    if (!user) {
      return res.json({ status: "error" });
    }
    const followingCount = user.following?.length || 0;
    return res.json({ status: "ok", followingCount: followingCount });
  } catch (err) {
    console.log(err);
  }
});

//update recommendation
router.post("/updaterecommendation", async (req, res) => {
  try {
    if (!req.body.userid) {
      return res.json({ status: "error", message: "user not found" });
    }
    const category = req.body.itemcategory;
    const userId = req.body.userid;
    const user = await UserModel.findById(userId);
    if (user.recommendation.length < 10) {
      user.recommendation.unshift(category);
    } else {
      user.recommendation.pop();
      user.recommendation.unshift(category);
    }
    user.save();
    res.json({ status: "recommendation updated" });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", message: err });
  }
});

router.get("/getrecommendation", async (req, res) => {
  try {
    function mostFrequent(arr, n) {
      if (n === 0) {
        return null;
      }
      arr.sort();
      let max_count = 1,
        res = arr[0];
      let curr_count = 1;

      for (let i = 1; i < n; i++) {
        if (arr[i] == arr[i - 1]) curr_count++;
        else curr_count = 1;

        if (curr_count > max_count) {
          max_count = curr_count;
          res = arr[i - 1];
        }
      }
      return res;
    }

    const userid = req.query.userid;
    if (!userid) {
      return res.json({ status: "error" });
    }
    const user = await UserModel.findById(userid);

    let recommended = mostFrequent(
      user.recommendation,
      user.recommendation.length
    );
    res.json({ status: "success", recommended: recommended });
  } catch (err) {
    console.log(err);
    res.json({ status: "error" });
  }
});

// create otp into user schema
router.post("/createotp", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const user = await UserModel.findOne({ email: email });
    user.otp = otp;
    await user.save();
    const msg = {
      to: req.body.email,
      from: "yongbin0162@gmail.com",
      subject: "LoaNUS - OTP verification",
      text: `To authenticate, please use the following One Time Password (OTP):
      ${otp} \n Don't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card or banking info. 
      We hope to see you again soon. \n If you didn't request to reset your password, you may safely ignore this email.
      `,
      html: `<h1>Dear User,</h1>
      <p>To authenticate, please use the following One Time Password (OTP):
      ${otp}</p>
      <p> Don't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card or banking info. 
      We hope to hear from you again soon.</p>
      <p> If you didn't request to reset your password, you may safely ignore this email.</p>
      `,
    };

    sgMail.send(msg, function (err, info) {
      if (err) {
        console.log("Email Not Sent");
      }
    });
    res.json({ status: "success" });
  } catch (error) {
    console.log(err);
    res.json({ status: "error" });
  }
});

// get otp
router.get("/getotp", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await UserModel.findOne({ email: email });
    let otp = user.otp;
    res.json({ status: "success", otp: otp });
  } catch (error) {
    console.log(error);
    res.json({ status: "error" });
  }
});

// change password
router.post("/changepassword", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.newpassword;
    const user = await UserModel.findOne({ email: email });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error" });
  }
});

// Reviews

router.post("/createreview", async (req, res) => {
  try {
    const userId = req.body.userId;
    const otheruserId = req.body.otheruserId;
    const user = await UserModel.findById(userId);
    const otheruser = await UserModel.findById(otheruserId);
    const reviewer = {
      reviewee: otheruserId,
      revieweeName: req.body.otheruserName,
      rating: req.body.rating,
      comments: req.body.comments,
    };
    const reviewee = {
      reviewer: userId,
      reviewerName: req.body.userName,
      rating: req.body.rating,
      comments: req.body.comments,
    };
    user.reviewscreated.unshift(reviewer);
    otheruser.reviews.unshift(reviewee);
    await user.save();
    await otheruser.save();
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "error" });
  }
});

//get rating
router.get("/getrating", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await UserModel.findById(userId);
    const reviews = user.reviews;
    let array = [];
    reviews.forEach((element) => array.unshift(element["rating"]));
    const sum = array.reduce((a, b) => a + b, 0);
    const avg = sum / array.length || 0;
    res.status(200).json({ status: "success", rating: avg });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
});

router.get("/getreviews", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await UserModel.findById(userId);
    const reviews = user.reviews;
    res.status(200).json({ status: "success", reviews: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
});

module.exports = router;
