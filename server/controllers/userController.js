const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");

const changePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    const err = new Error("Please provide both old and new passwords.");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    throw err;
  }

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    const err = new Error("Incorrect old password.");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  user.mustChangePassword = false;

  await user.save();
  res.status(200).json({ message: "Password updated successfully." });
});

module.exports = { changePassword };
