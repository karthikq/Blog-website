/** @format */

var Router = require("router");
var router = Router();
const { registerValidation, loginValidation } = require("../validation/Joi");
const bcrypt = require("bcrypt");
const User = require("../models/Usersmodel");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const uploadedImage = require("../cloud/storage");
const upload = require("../router/Fileupload");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const validation = loginValidation(req.body);

  let errors = [];
  if (validation.error) {
    errors.push({ message: validation.error.details[0].message });
  }

  const userExists = await User.findOne({ email: email });
  if (!userExists) errors.push({ message: "User doesnt exists" });

  if (errors.length > 0) {
    return res.render("login", { errors: errors });
  }

  bcrypt.compare(password, userExists.password, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      let token = jwt.sign({ user: email }, "shhhhh", {
        expiresIn: "24h",
      });

      res.cookie("authtoken", token, {
        maxAge: 9000000,
        httpOnly: true,
        secure: true,
      });

      res.redirect(`/?user=${userExists.name}&auth=${true}`);
    } else {
      errors.push({ message: "Entered password is wrong" });
      res.render("login", { errors: errors });
    }
  });
});

router.get("/register", (req, res, next) => {
  res.render("register");
});
router.post("/register", upload.single("image"), async (req, res) => {
  const { name, email, password, password2 } = req.body;

  let errors = [];
  let data = {
    name: name,
    email: email,
  };
  try {
    const imageUrl = await uploadedImage(req.file);

    const value = registerValidation(req.body);

    if (value.error) {
      errors.push({ message: value.error.details[0].message });
    }

    if (password != password2)
      errors.push({ message: "password doesn't match" });

    const userNameExists = await User.findOne({ name: name });
    if (userNameExists) {
      errors.push({ message: "Try a different Name" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) errors.push({ message: "Email Already exists!!!" });

    if (errors.length > 0) {
      return res.render("register", { errors: errors, data });
    }

    // generating token
    var token = jwt.sign({ user: email }, "shhhhh", {
      expiresIn: "24h",
    });

    // intializing storage
    res.cookie("authtoken", token, { maxAge: 9000000, httpOnly: true });

    // hashing password
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      const user = await new User({
        name,
        img: imageUrl,
        email,
        password: hash,
        password2,
      });
      await user.save();

      res.redirect(`/?user=${name}&auth=${true}`);
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("authtoken");
  res.redirect("/user/login");
});

module.exports = router;
