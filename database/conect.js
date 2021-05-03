/** @format */

const express = require("express");
const mongoose = require("mongoose");

const db = mongoose.connect(
  "mongodb+srv://Admin-Karthik:qwerty12@cluster0.semtp.mongodb.net/blogposts",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

module.exports = db;
