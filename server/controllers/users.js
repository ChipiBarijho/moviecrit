const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
} = require("../authenticate");

module.exports.register = async (req, res, next) => {
  const { username, email, firstName, lastName, password } = req.body;

  // Check if email provided already exists with mongose find() query
  const checkEmail = await User.find({ email: email });
  if (checkEmail.length) {
    return res.status(409).send({
      name: "EmailExists",
      message: "Email already in use",
    });
  }

  // Verify that email is not empty
  if (!req.body.email) {
    res.statusCode = 500;
    res.send({
      name: "EmailRequiredError",
      message: "An email is required",
    });
  } else {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          user.email = req.body.email;
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName || "";
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
              res.send({ success: true, token });
            }
          });
        }
      }
    );
  }
};

module.exports.login = async (req, res, next) => {
  const { _id } = req.user;
  const token = getToken({ _id: _id });
  const refreshToken = getRefreshToken({ _id: _id });
  const user = await User.findById(_id);
  user.refreshToken.push({ refreshToken });
  user.save((err, user) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ success: true, token, refreshToken });
    }
  });
};

module.exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        // Find the refresh token against the user record in database
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken
        );
        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken({ _id: userId });
          // If the refresh token exists, then create new one and replace it.
          const newRefreshToken = getRefreshToken({ _id: userId });
          user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
          user.save((err, user) => {
            if (err) {
              res.statusCode = 500;
              res.send(err);
            } else {
              res.send({ success: true, token, newRefreshToken });
            }
          });
        }
      } else {
        res.statusCode = 401;
        res.send("Unauthorized");
      }
    } catch (error) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    // When someone is not authenticated
    // res.statusCode = 401;
    // res.send("Unauthorized");
  }
};

module.exports.userInfo = (req, res, next) => {
  res.send(req.user);
};

module.exports.logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  const user = await User.findById(req.user._id);
  const tokenIndex = user.refreshToken.findIndex(
    (item) => item.refreshToken === refreshToken
  );
  if (tokenIndex !== -1) {
    user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
  }
  user.save((err, user) => {
    if (err) {
      res.statusCode = 500;
      res.send(err);
    } else {
      res.status(200).send({ success: true });
    }
  });
};

module.exports.userProfile = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .select("reviews likedReviews firstName lastName username profileImg")
      .populate({ path: "reviews", populate: { path: "movieId" } })
      .populate("likedReviews");
    res.send(user);
  } catch (error) {
    res.send(404);
    console.log(error);
  }
};

module.exports.addProfilePhoto = async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const { imgUrl } = req.body;

  try {
    if (id === _id.toString()) {
      await User.findByIdAndUpdate(_id, { profileImg: imgUrl });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.sendStatus(404);
  }
};
