var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const upload = require("./multer");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("main");
});
router.get("/shop", function (req, res, next) {
  res.render("shop");
});
router.get("/c_account", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.get("/feed", function (req, res, next) {
  res.render("feed");
});

// profile route
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(user);
  res.render("profile", { user });
});
router.get("/createuser", async function (req, res) {
  let createduser = await userModel.create({
    username: "Ankush",
    password: "ankush123",
    email: "ankushkumayu04@gmail.com",
    fullName: "Ankush Kumayu",
  });
  res.send(createduser);
});
router.get("/createpost", async function (req, res) {
  let createdpost = await postModel.create({
    postText: "Hello Everyone",
    user: "65e2d5f678e293c0eaddb3c6",
  });
  let user = await userModel.findOne({ _id: "65e2d5f678e293c0eaddb3c6" });
  user.posts.push(createdpost._id);
  await user.save();
  res.send("Done Ho gya Bhai");
});

router.get("/alluserposts", async function (req, res, next) {
  let user = await userModel
    .findOne({ _id: "65e2d5f678e293c0eaddb3c6" })
    .populate("posts");
  res.send(user);
});

router.post("/register", async function (req, res) {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res, next) {}
);

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(404).send("no files were given");
    }
    // jo file upload hui hai use save kro as a post and uska postid user ko do and post ko userid do
    const user = await userModel
      .findOne({
        username: req.session.passport.user,
      })
      .populate("posts");

    const post = await postModel.create({
      image: req.file.filename,
      imageText: req.body.filecaption,
      user: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

module.exports = router;