const router = require("express").Router();
const { User } = require("../models");

router.use((req, res, next) => {
  console.log("User middleware");
  next();
});

router.put("/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Ensure both fields are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both old and new passwords." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password." });
    }

    user.password = newPassword;
    user.mustChangePassword = false;

    await user.save();
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
