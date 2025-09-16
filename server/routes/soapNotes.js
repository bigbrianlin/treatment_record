const router = require("express").Router();
const SoapNote = require("../models").soapNote;
const Patient = require("../models").patient;
const soapNoteValidation = require("../validation").soapNoteValidation;

// Middleware to log requests to this router
router.use((req, res, next) => {
  console.log("SOAP Note middleware");
  next();
});

// Test API endpoint
// router.get("/testAPI", (req, res) => {
//   return res.send("SOAP Note API is working properly");
// });

// Get all SOAP notes
router.get("/", async (req, res) => {
  try {
    let soapNoteFound = await SoapNote.find().sort({ createdAt: -1 });
    return res.send(soapNoteFound);
  } catch (err) {
    return res.status(500).send("Error fetching SOAP notes: " + err.message);
  }
});

// Get a specific SOAP note by member ID
router.get("/user/:_user_id", async (req, res) => {
  let { _user_id } = req.params;
  try {
    let soapNotesFound = await SoapNote.find({ therapist: _user_id }).sort({ createdAt: -1 }).exec();
    return res.send(soapNotesFound);
  } catch (err) {
    return res.status(500).send("Error fetching SOAP notes: " + err.message);
  }
});

// Create a new SOAP note
router.post("/", async (req, res) => {
  // validate the SOAP note data here if needed
  let { error } = soapNoteValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { patient, disabilityCategory, treatmentDate, sessionCount, subjective, objective, assessment, plan } = req.body;

  try {
    const patientExists = await Patient.findById(patient);
    if (!patientExists) return res.status(404).send("Patient does not exist");
  } catch (err) {
    return res.status(500).send("Error verifying patient: " + err.message);
  }

  try {
    let newSoapNote = new SoapNote({
      therapist: req.user._id,
      patient,
      disabilityCategory,
      treatmentDate,
      sessionCount,
      subjective,
      objective,
      assessment,
      plan,
    });
    let savedSoapNote = await newSoapNote.save();

    let populatedSoapNote = await SoapNote.findById(savedSoapNote._id)
      .populate({
        path: "patient",
        select: "name birthDate age gender",
      })
      .populate({
        path: "therapist",
        select: "username",
      });

    return res.status(201).send({ message: "SOAP Note created successfully", populatedSoapNote });
  } catch (err) {
    return res.status(500).send("Error creating SOAP Note: " + err.message);
  }
});

module.exports = router;
