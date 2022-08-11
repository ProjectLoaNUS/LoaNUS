const following = (socketUtils) => {
  const router = require("express").Router();
  const UserModel = require("../models/Users");
  const auth = require("../utils/auth");

  //follow a user
  router.post("/followuser", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
    const followeduser = req.body.followed;
    let otherusermodel = await UserModel.findById(followeduser);

    if (!user.following.includes(followeduser)) {
      user.following.push(followeduser);
    }
    if (!otherusermodel.followers.includes(userId)) {
      otherusermodel.followers.push(userId);
    }

    socketUtils.notify(null, followeduser,
        `New follower "${user.name}"`, "/profile/follow");

    try {
      let checkotheruser = await otherusermodel.save();
      let checkuser = await user.save();
      res.status(200).json(checkuser);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //unfollow a user
  router.post("/unfollowuser", async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({error: "JWT User ID is missing"});
    }
    const userId = req.user.id;
    const user = await auth.getUser(userId);
    if (!user) {
      return res.status(401).json({error: "JWT User ID is invalid"});
    }
    const followeduser = req.body.unfollowed;
    let otherusermodel = await UserModel.findById(followeduser);
    if (user.following.includes(followeduser)) {

      user.following = user.following.filter(function (item) {
        return item !== followeduser;
      });
    }
    if (otherusermodel.followers.includes(userId)) {

      otherusermodel.followers = otherusermodel.followers.filter(function (item) {
        return item !== userId;
      });
    }

    try {
      let checkuser = await user.save();
      let othercheckuser = await otherusermodel.save();
      res.status(200).json(checkuser);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get following

  router.get("/getfollowing", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({error: "JWT User ID is missing"});
      }
      const userId = req.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return res.status(401).json({error: "JWT User ID is invalid"});
      }

      let followingarray = user.following;

      const array = await UserModel.find({ _id: { $in: followingarray } }, [
        "_id",
        "name"
      ]);

      res.status(200).json({followings: array});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get followers
  router.get("/getfollowers", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({error: "JWT User ID is missing"});
      }
      const userId = req.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return res.status(401).json({error: "JWT User ID is invalid"});
      }

      let followersarray = user.followers;

      const array = await UserModel.find({ _id: { $in: followersarray } }, [
        "_id",
        "name"
      ]);

      res.status(200).send(array);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //get following id

  router.get("/getfollowingid", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({error: "JWT User ID is missing"});
      }
      const userId = req.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return res.status(401).json({error: "JWT User ID is invalid"});
      }

      let followingarray = user.following;

      res.status(200).json({followings: followingarray});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //get followers id
  router.get("/getfollowersid", async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({error: "JWT User ID is missing"});
      }
      const userId = req.user.id;
      const user = await auth.getUser(userId);
      if (!user) {
        return res.status(401).json({error: "JWT User ID is invalid"});
      }

      let followersarray = user.followers;

      res.status(200).send(followersarray);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  return router;
}

module.exports = following;
