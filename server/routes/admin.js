const router = require("express").Router();
const { User } = require("../models");

// Middleware to check if the authenticated user is an admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden. Admin access required." });
};

router.use(requireAdmin);

router.post("/users", async (req, res) => {
  try {
    const { username, role, firstname, lastname, email, phoneNumber } = req.body;

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
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/users/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const userFound = await User.findById(_id);

    if (!userFound) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.json(userFound);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    return res.status(500).json({ message: "Error fetching user: " + err.message });
  }
});

module.exports = router;
