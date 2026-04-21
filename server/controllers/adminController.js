const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res, next) => {
  const { username, role, firstname, lastname, email, phoneNumber } = req.body;

  if (!username || !role || !firstname || !lastname) {
    const err = new Error("Please provide all required fields.");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    const err = new Error("Username already exists.");
    err.statusCode = 400;
    throw err;
  }

  const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "12345678";

  const newUser = new User({
    username,
    password: defaultPassword,
    role,
    firstname,
    lastname,
    email,
    phoneNumber,
  });

  await newUser.save();

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
    },
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

const getUserById = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const userFound = await User.findById(_id).select("-password");

  if (!userFound) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json(userFound);
});

module.exports = { createUser, getAllUsers, getUserById };
