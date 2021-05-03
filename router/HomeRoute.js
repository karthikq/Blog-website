/** @format */

const express = require("express");
var Router = require("router");
var router = Router();
const Post = require("../models/postsmodel");
const User = require("../models/Usersmodel");
var jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyToken(req, res, next) {
  const token = req.cookies.authtoken;

  if (token === null) return res.redirect("/user/login");

  try {
    jwt.verify(token, "shhhhh", (err, data) => {
      if (err) res.redirect("/user/login");
      req.user = data;
      next();
    });
  } catch (error) {
    res.redirect("/user/login");
  }
}
// getting all posts
router.get("/", verifyToken, async (req, res) => {
  const userData = await User.findOne({ email: req.user.user });
  const user = req.query.user;
  const auth = req.query.auth;

  if (auth) {
    try {
      Post.find({})
        .sort({ $natural: -1 })
        .exec((err, docs) => {
          res.render("home", {
            posts: docs,
            userData,
            errors: req.session.error,
            user: user,
          });
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect("/user/login");
  }
});
// submiting posts
router.post("/", verifyToken, async (req, res) => {
  const { name, post } = req.body;
  var date = new Date();
  const userList = await User.findOne({ name });
  try {
    const value = new Post({
      name: name,
      post: post,
      year: date.toLocaleDateString(),
      img: userList.img,
      date: date,
    });
    await value.save();
    res.redirect(`/?user=${name}&auth=${true}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/posts", verifyToken, async (req, res) => {
  const userP = req.query.user;

  const userPosts = await User.findOne({ email: req.user.user });

  res.render("posts", { userPosts, user: userP });
});

router.get("/user/post/:id", verifyToken, async (req, res) => {
  const user = req.query.user;

  const userData = await Post.findOne({ _id: req.params.id });
  res.render("user", { userData, user: user });
});
router.get("/edit/:id", verifyToken, async (req, res) => {
  const id = req.params.id;

  const user = req.user.user;

  try {
    const userData = await Post.findOne({ _id: id });
    const userData2 = await User.findOne({ email: user });

    if (userData.name === userData2.name) {
      res.render("edit", { userData });
    } else {
      req.session.error = `You are not ${userData.name} are you??`;
      res.redirect(`?user=${user}&auth=${true}`);
    }
  } catch (error) {
    console.log(error);
  }

  // console.log(userData);
  // res.render("edit", { userData });
});
router.put("/edit/:id", async (req, res) => {
  const userId = req.params.id;

  const query = { _id: userId };
  const { name, post } = req.body;

  try {
    const findUser = await Post.findOneAndUpdate(query, {
      name: name,
      post: post,
    });
    if (!findUser) return console.log("user not Found");

    res.redirect(`/?user=${name}&auth=${true}`);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  const postId = req.params.id;
  const userEmail = req.user.user;

  try {
    const userData = await User.findOne({ email: userEmail });
    const postData = await Post.findOne({ _id: postId });

    if (userData.name === postData.name) {
      const deleteItem = await Post.deleteOne({ _id: postData._id });
      if (!deleteItem) return console.log("not found");

      res.redirect(`/?user=${userData.name}&auth=${true}`);
    } else {
      req.session.error = `Are you ${postData.name}'s cousin ? 🙄 `;
      res.redirect(`/?user=${userData.name}&auth=${true}`);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/users/post/:id", async (req, res) => {
  const userID = req.params.id;
  const userName = req.query.user;
  try {
    const userDetails = await Post.find({ name: userID });
    const post = await Post.findOne({ name: userID });

    res.render("userposts", { userDetails, post, user: userName });
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
