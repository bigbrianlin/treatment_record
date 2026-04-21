const router = require("express").Router();
const userController = require("../controllers/userController");

router.use((req, res, next) => {
  console.log("User middleware");
  next();
});

router.put("/change-password", userController.changePassword);

module.exports = router;
