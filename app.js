/** @format */
const express = require("express");
const bodyParser = require("body-parser");
const Post = require("./models/postsmodel");
var cors = require("cors");
var cookieParser = require("cookie-parser");
require("./database/conect");
var session = require("express-session");
var methodOverride = require("method-override");
const port = process.env.PORT || 3000;

require("dotenv").config();

const app = express();

app.use(methodOverride("_method"));
app.use(
  cors({
    origin: ["*"],
    method: ["GET"],
    maxAgeSeconds: 3600,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3000 },
  })
);

app.use("/", require("./router/HomeRoute"));
app.use("/user", require("./router/UsersRoute"));

app.listen(port, function () {
  console.log("server is running");
});
