/** @format */

const express = require("express");
const mongoose = require("mongoose");
require("../models/postsmodel");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      reqiored: true,
    },
    passsword2: {
      type: String,
      reqiored: true,
    },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
