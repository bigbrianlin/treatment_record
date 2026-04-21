const router = require("express").Router();
const soapNoteController = require("../controllers/soapNoteController");
// Middleware to log requests to this router
router.use((req, res, next) => {
  console.log("SOAP Note middleware");
  next();
});

// Define routes and map them to controller functions
router.get("/", soapNoteController.getAllSoapNotes);
router.get("/:_id", soapNoteController.getSoapNoteById);
router.get("/patient/:patientId", soapNoteController.getNotesByPatientId);
router.post("/", soapNoteController.createSoapNote);
router.patch("/:_id", soapNoteController.updateSoapNote);
router.delete("/:_id", soapNoteController.deleteSoapNote);

module.exports = router;
