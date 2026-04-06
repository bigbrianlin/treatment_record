const router = require("express").Router();
const { User } = require("../models");
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

  // check if the account is active
  if (!foundUser.isActive) {
    return res.status(403).json({
      message: "Account has been deactivated. Please contact the administrator.",
    });
  }

  // check if password is correct
  const validPassword = await foundUser.comparePassword(req.body.password);
  if (!validPassword) return res.status(401).send("Username does not exist or password is incorrect");

  foundUser.lastLoginAt = new Date();
  // Use validateBeforeSave: false to avoid triggering other validations during login
  await foundUser.save({ validateBeforeSave: false });

  // ---- JWT token generation logic ----
  // after password is validated, generate a token and send to client

  // create and assign a token
  const payload = {
    _id: foundUser._id,
    username: foundUser.username,
    role: foundUser.role,
  };

  // sign the token
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ _id: foundUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  foundUser.refreshToken.push(refreshToken);
  await foundUser.save({ validateBeforeSave: false });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "Strict", // Prevents CSRF attacks
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });

  try {
    return res.status(200).send({
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
  } catch (err) {
    return res.status(500).send("Error logging in: " + err.message);
  }
});

router.get("/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser._id.toString() !== decoded._id) return res.sendStatus(403);

    const payload = {
      _id: foundUser._id,
      username: foundUser.username,
      role: foundUser.role,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

    res.json({ token: "Bearer " + accessToken });
  });
});

router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

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

module.exports = router;
