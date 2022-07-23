const following = (socketUtils) => {
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

  //get following

  router.get("/getfollowing", async (req, res) => {
    try {
      const user = await UserModel.findById(req.query.userId);
      let followingarray = user.following;

      const array = await UserModel.find({ _id: { $in: followingarray } }, [
        "_id",
        "name",
        "image",
      ]);

      res.status(200).send(array);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get followers
  router.get("/getfollowers", async (req, res) => {
    try {
      const user = await UserModel.findById(req.query.userId);
      let followersarray = user.followers;

      const array = await UserModel.find({ _id: { $in: followersarray } }, [
        "_id",
        "name",
        "image",
      ]);

      res.status(200).send(array);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get following id

  router.get("/getfollowingid", async (req, res) => {
    try {
      const user = await UserModel.findById(req.query.userId);
      let followingarray = user.following;

      res.status(200).json(followingarray);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get followers id
  router.get("/getfollowersid", async (req, res) => {
    try {
      const user = await UserModel.findById(req.query.userId);
      let followersarray = user.followers;

      res.status(200).send(followersarray);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
}

module.exports = following;
