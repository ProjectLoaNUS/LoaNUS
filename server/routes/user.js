const express = require("express");
const router = express.Router();
const UserModel = require("../models/Users");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer");
const auth = require("../utils/auth");
const jwt = require("jsonwebtoken");

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
      return res.status(400).json({
        errorCode: hasUserResultCodes.ALTERNATE_SIGN_IN,
      });
    }
    return res.status(200).json({
      hasUser: false,
    });
  }
  return res.status(200).json({
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
    return res.status(400).json({
      errorCode: signInResultCodes.NO_SUCH_USER,
      error: `User doesn't exist`,
    });
  }
  if (!givenUser.password) {
    return res.status(400).json({
      errorCode: signInResultCodes.ALTERNATE_SIGN_IN,
      error: `User account uses 3rd party log in method`,
    });
  }
  if (!givenUser.isVerified) {
    return res.status(400).json({
      errorCode: signInResultCodes.EMAIL_NOT_VERIFIED,
      error: `User yet to verify account`,
    });
  }
  await bcrypt.compare(req.body.password, givenUser.password, (err, result) => {
    if (err) {
      return res.status(500).json({
        errorCode: signInResultCodes.UNKNOWN,
        error: err,
      });
    }
    if (result) {
      const token = jwt.sign(
        {id: "" + givenUser._id},
        auth.JWT_SECRET,
        {expiresIn: auth.JWT_EXPIRES_IN}
      );
      return res.status(200).json({
        user: {
          token: token,
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
    return res.status(400).json({
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
    try {
      const userId = "" + user._id;
      const token = jwt.sign(
        {id: userId},
        auth.JWT_SECRET,
        {expiresIn: auth.JWT_EXPIRES_IN}
      );
      let trimmedUser = {
        token: token,
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
      return res.status(200).json({ user: trimmedUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
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
        return res.status(500).json({ error: err });
      }
    });
    try {
      const token = jwt.sign(
        {id: "" + user._id},
        auth.JWT_SECRET,
        {expiresIn: auth.JWT_EXPIRES_IN}
      );
      let trimmedUser = {
        token: token,
        displayName: user.name,
        age: user.age,
        email: user.email,
      };
      return res.status(200).json({ user: trimmedUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
});

router.post("/signUp", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  if (!password) {
    return res.status(400).json({ error: "Password not provided(required field)" });
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
      return res.status(500).json({ error: err });
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
      return res.status(500).json({ error: err });
    }
  });
  const token = jwt.sign(
    {id: "" + newUser._id},
    auth.JWT_SECRET,
    {expiresIn: auth.JWT_EXPIRES_IN}
  );
  return res.status(200).json({ token: token });
});
router.post("/getNamesOf", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  const users = req.body.users;
  if (!users?.length) {
    return res.status(400).json({ error: "No user IDs provided" });
  }
  const userDetails = await UserModel.find(
    { _id: { $in: users.map((someUser) => someUser.userId) } },
    ["_id", "name"]
  );
  return res.status(200).json({ userDetails: userDetails });
});

// Email verification route
router.get("/verifyEmail", async (req, res) => {
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

router.get("/getProfilePic", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  return res.status(200).json({ image: user.image });
});

//Upload profile picture
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldsize: 1024 * 1024 * 3 },
});
router.post("/setProfilePic", upload.single("image"), async (request, response) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }
  
  try {
    const imageprop = {
      data: request.file.buffer,
      contentType: request.file.mimetype,
    };
    user.image = imageprop;
    user.save();
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error});
  }
});

router.get("/getPoints", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = req.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return res.status(401).json({error: "JWT User ID is invalid"});
  }

  return res.status(200).json({ points: user.points });
});

//UserSearch
router.get("/search", async (request, response) => {
  if (!request.user || !request.user.id) {
    return response.status(401).json({error: "JWT User ID is missing"});
  }
  const userId = request.user.id;
  const user = await auth.getUser(userId);
  if (!user) {
    return response.status(401).json({error: "JWT User ID is invalid"});
  }

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
      return response.status(200).json({ results: results });
    }

    response.status(500).json({ error: "Error while performing autocomplete search in MongoDB" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: error });
  }
});
router.get("/getFollowersCount", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const followersCount = user.followers?.length || 0;
    return res.status(200).json({ followersCount: followersCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
router.get("/getFollowingCount", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
    const followingCount = user.following?.length || 0;
    return res.status(200).json({ followingCount: followingCount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});

//update recommendation
router.post("/updaterecommendation", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
  
    const category = req.body.itemcategory;
    if (user.recommendation.length < 10) {
      user.recommendation.unshift(category);
    } else {
      user.recommendation.pop();
      user.recommendation.unshift(category);
    }
    user.save();
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getrecommendation", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

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

    let recommended = mostFrequent(
      user.recommendation,
      user.recommendation.length
    );
    res.status(200).json({ recommended: recommended });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

// create otp into user schema
router.post("/createotp", async (req, res) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const user = await UserModel.findOne({
      $and: [{ email: email }, { password: { $exists: true } }],
    });
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
        return res.status(500).json({ error: err });
      }
    });
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// get otp
router.get("/getotp", async (req, res) => {
  try {
    const email = req.user.email;
    const user = await UserModel.findOne({
      $and: [{ email: email }, { password: { $exists: true } }],
    });
    let otp = user.otp;
    const token = jwt.sign(
      {id: "" + user._id},
      auth.JWT_SECRET,
      {expiresIn: auth.JWT_EXPIRES_IN}
    );
    res.status(200).json({ otp: otp, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// change password
router.post("/changepassword", async (req, res) => {
  try {
    const email = req.user.email;
    const password = req.body.newpassword;
    const user = await UserModel.findOne({
      $and: [{ email: email }, { password: { $exists: true } }],
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    const token = jwt.sign(
      {id: "" + user._id},
      auth.JWT_SECRET,
      {expiresIn: auth.JWT_EXPIRES_IN}
    );
    res.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// Reviews

router.post("/createreview", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
  
    const otheruserId = req.body.otheruserId;
    const otheruser = await UserModel.findById(otheruserId);
    const reviewer = {
      reviewee: otheruserId,
      revieweeName: req.body.otheruserName,
      rating: req.body.rating,
      comments: req.body.comments,
    };
    const reviewee = {
      reviewer: userId,
      reviewerName: user.name,
      rating: req.body.rating,
      comments: req.body.comments,
    };
    user.reviewscreated.unshift(reviewer);
    otheruser.reviews.unshift(reviewee);
    await user.save();
    await otheruser.save();
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

//get rating
router.get("/getrating", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const reviews = user.reviews;
    let array = [];
    reviews.forEach((element) => array.unshift(element["rating"]));
    const sum = array.reduce((a, b) => a + b, 0);
    const avg = sum / array.length || 0;
    res.status(200).json({ rating: avg });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.get("/getreviews", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }

    const reviews = user.reviews;
    res.status(200).json({ reviews: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;
