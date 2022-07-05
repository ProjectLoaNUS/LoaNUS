const router = require("express").Router();
const UserModel = require("../models/Users");

//follow a user
router.post("/followuser", async (req, res) => {
  const followeduser = req.body.followed;
  const user = req.body.follower;
  let usermodel = await UserModel.findById(user);
  let otherusermodel = await UserModel.findById(followeduser);

  if (!usermodel.following.includes(followeduser)) {
    usermodel.following.push(followeduser);
  }
  if (!otherusermodel.followers.includes(user)) {
    otherusermodel.followers.push(user);
  }

  try {
    let checkotheruser = await otherusermodel.save();
    let checkuser = await usermodel.save();
    res.status(200).json(checkuser);
  } catch (err) {
    res.status(500).json(err);
  }
});
//unfollow a user
router.post("/unfollowuser", async (req, res) => {
  const followeduser = req.body.unfollowed;
  const user = req.body.follower;
  let usermodel = await UserModel.findById(user);
  let otherusermodel = await UserModel.findById(followeduser);
  if (usermodel.following.includes(followeduser)) {
    let index = usermodel.following.indexOf(followeduser);

    usermodel.following = usermodel.following.filter(function (item) {
      return item !== followeduser;
    });
  }
  if (otherusermodel.followers.includes(user)) {
    let index = otherusermodel.followers.indexOf(user);

    otherusermodel.followers = otherusermodel.followers.filter(function (item) {
      return item !== user;
    });
  }

  try {
    let checkuser = await usermodel.save();
    let othercheckuser = await otherusermodel.save();
    res.status(200).json(checkuser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
