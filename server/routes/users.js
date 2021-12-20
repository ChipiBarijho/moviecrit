const express = require("express");
const router = express.Router();
const passport = require("passport");

// Controllers
const usersController = require("../controllers/users");

// Middleware
const { verifyUser } = require("../authenticate");

// Routes
router.get("/userInfo", verifyUser, usersController.userInfo);

router.post("/logout", verifyUser, usersController.logout);

router.post("/login", passport.authenticate("local"), usersController.login);

router.post("/signup", usersController.register);

router.post("/refreshToken", usersController.refreshToken);
router.get("/:id", usersController.userProfile);
router.post(
  "/:id/addProfilePhoto",
  verifyUser,
  usersController.addProfilePhoto
);

module.exports = router;
