/** @format */

const express = require("express");
const mongoose = require("mongoose");
require("../models/postsmodel");

const PostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trime: true,
    },
    post: {
      type: String,
      required: true,
    },
    year: String,
    img: {
      type: String,
    },
    date: String,
  },
  {
    timestamps: { currentTime: () => Date.now() },
  }
);

const Post = mongoose.model("posts", PostSchema);

module.exports = Post;
