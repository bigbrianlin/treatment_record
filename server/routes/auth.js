const router = require("express").Router();
const authController = require("../controllers/authController");

router.use((req, res, next) => {
  console.log("Auth middleware");
  next();
});

router.get("/", authController.getAllUsers);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
