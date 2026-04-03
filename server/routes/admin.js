const router = require("express").Router();
const { User } = require("../models");

// Middleware to check if the authenticated user is an admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden. Admin access required." });
};

router.post("/users", requireAdmin, async (req, res) => {
  try {
    const { username, role, firstname, lastname } = req.body;

    if (!username || !role || !firstname || !lastname) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const defaultPassword = process.env.DEFAULT_USER_PASSWORD;

    const newUser = new User({
      username,
      password: defaultPassword,
      role,
      firstname,
      lastname,
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
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
