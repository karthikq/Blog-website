/** @format */

let multer = require("multer");
const path = require("path");
let storage = multer.diskStorage({
  // this will specify the destination
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  // name of the file
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb("file not supporeted", false);
  }
};
var upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
