const router = require("express").Router();
const adminController = require("../controllers/adminController");

// Middleware to check if the authenticated user is an admin
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden. Admin access required." });
};

router.use(requireAdmin);

router.post("/users", adminController.createUser);
router.get("/users", adminController.getAllUsers);
router.get("/users/:_id", adminController.getUserById);

module.exports = router;
