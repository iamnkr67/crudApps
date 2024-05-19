const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");


// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

//Insert an user into database route
router.post("/add", upload, async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });

  try {
    await user.save();
    req.session.message = {
      message: "User added successfully",
      type: "success",
    };
    res.redirect("/");
  } catch (error) {
    req.session.message = {
      message: error.message,
      type: "danger",
    };
  }
});

// Add Users
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

//Get all the user route
router.get("/", async (req, res) => {
  try {
    const users = await User.find().exec();
    res.render("dashboard", {
      title: "Home",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});

// Edit/Update User
router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      res.redirect("/");
    } else {
      res.render("edit_user", { title: "Edit User", user: user });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Delete the user
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.redirect("/");
    } else {
      await User.deleteOne(user);
      req.session.message = {
        message: "User Deleted Successfully",
        type: "success",
      };
      res.redirect("/");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/update/:id", upload, async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    const user = await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });
    if (!user) {
      res.redirect("/");
    } else {
      req.session.message = {
        type: "success",
        message: "User updated successfully",
      };
      res.redirect("/");
    }
  } catch (error) {
    res.json({ message: error.message, type: "danger" });
  }
});

module.exports = router;
