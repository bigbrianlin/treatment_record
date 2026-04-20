const router = require("express").Router();
const patientController = require("../controllers/patientController");

// Middleware to log requests to this router
router.use((req, res, next) => {
  console.log("Patient middleware");
  next();
});

router.get("/", patientController.getAllPatients);
router.get("/:_id", patientController.getPatientById);
router.post("/", patientController.createPatient);
router.patch("/:_id", patientController.updatePatient);
router.delete("/:_id", patientController.deletePatient);

module.exports = router;
