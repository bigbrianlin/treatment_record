const { User } = require("../models");
const { loginValidation } = require("../validation");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json(users);
});

const login = catchAsync(async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const foundUser = await User.findOne({ username: req.body.username });
  if (!foundUser) {
    const err = new Error("Username does not exist or password is incorrect");
    err.statusCode = 401;
    throw err;
  }

  if (!foundUser.isActive) {
    const err = new Error("Account has been deactivated. Please contact the administrator.");
    err.statusCode = 403;
    throw err;
  }

  const validPassword = await foundUser.comparePassword(req.body.password);
  if (!validPassword) {
    const err = new Error("Username does not exist or password is incorrect");
    err.statusCode = 401;
    throw err;
  }

  foundUser.lastLoginAt = new Date();
  await foundUser.save({ validateBeforeSave: false });

  const payload = {
    _id: foundUser._id,
    username: foundUser.username,
    role: foundUser.role,
  };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "test_access", { expiresIn: "15m" });
  const refreshToken = jwt.sign({ _id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET || "test_refresh", {
    expiresIn: "7d",
  });

  foundUser.refreshToken.push(refreshToken);
  await foundUser.save({ validateBeforeSave: false });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Login successful",
    token: "Bearer " + accessToken,
    user: {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role,
      mustChangePassword: foundUser.mustChangePassword,
      firstname: foundUser.firstname,
      lastname: foundUser.lastname,
      email: foundUser.email,
      phoneNumber: foundUser.phoneNumber,
    },
  });
});

const refresh = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    const err = new Error("No refresh token found");
    err.statusCode = 401;
    throw err;
  }

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (!foundUser) {
    const err = new Error("Invalid refresh token");
    err.statusCode = 403;
    throw err;
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "test_refresh", (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded._id) {
      const verifyErr = new Error("Token verification failed");
      verifyErr.statusCode = 403;
      throw verifyErr;
    }

    const payload = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "test_access", { expiresIn: "15m" });

    res.json({ token: "Bearer " + accessToken });
  });
});

const logout = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();

  if (foundUser) {
    foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    await foundUser.save();
  }

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.sendStatus(204);
});

// Export without register
module.exports = { getAllUsers, login, refresh, logout };
