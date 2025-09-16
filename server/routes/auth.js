const router = require("express").Router();
const User = require("../models").user;
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("Auth middleware");
  next();
});

// Test API endpoint
// router.get("/testAPI", (req, res) => {
//   return res.send("API is working properly");
// });

// Get all users (for testing purposes)
router.get("/", async (req, res) => {
  try {
    let users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.send(users);
  } catch (err) {
    return res.status(500).send("Error fetching users: " + err.message);
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  // Validate the data before creating a user
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if username already exists
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) return res.status(400).send("Username already exists");

  let { username, password, role } = req.body;
  let newUser = new User({ username, password, role });

  try {
    let savedUser = await newUser.save();
    return res.send({ message: "User registered successfully", savedUser });
  } catch (err) {
    return res.status(500).send("Error registering user: " + err.message);
  }
});

router.post("/login", async (req, res) => {
  // Validate the data before logging in
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if username exists
  const foundUser = await User.findOne({ username: req.body.username });
  if (!foundUser) return res.status(401).send("Username does not exist or password is incorrect");

  // check if password is correct
  const validPassword = await foundUser.comparePassword(req.body.password);
  if (!validPassword) return res.status(401).send("Invalid password");

  // ---- JWT token generation logic ----
  // after password is validated, generate a token and send to client

  // create and assign a token
  const tokenObject = {
    _id: foundUser._id,
    username: foundUser.username,
    role: foundUser.role,
  };

  // sign the token
  const token = jwt.sign(tokenObject, process.env.JWT_SECRET, { expiresIn: "1d" });

  try {
    return res.status(200).send({
      message: "Login successful",
      token: "Bearer " + token,
      user: { _id: foundUser._id, username: foundUser.username, role: foundUser.role },
    });
  } catch (err) {
    return res.status(500).send("Error logging in: " + err.message);
  }
});

module.exports = router;
