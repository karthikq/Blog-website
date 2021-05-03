/** @format */

let firebase = require("firebase");
require("firebase/storage");
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyCp24JsGk9tX7BTC1t-ViV_nx5bl7jYTv0",
  authDomain: "blog-posts-1a74b.firebaseapp.com",
  projectId: "blog-posts-1a74b",
  storageBucket: "blog-posts-1a74b.appspot.com",
  messagingSenderId: "148340057566",
  appId: "1:148340057566:web:faace402817cb0488ba94f",
};

firebase.initializeApp(firebaseConfig);

let storage = firebase.storage();

module.exports = storage;
