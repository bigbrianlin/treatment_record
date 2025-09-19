const router = require("express").Router();
const { SoapNote } = require("../models");
const { Patient } = require("../models");
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

// Get my SOAP notes
router.get("/", async (req, res) => {
  try {
    let soapNotesFound = await SoapNote.find({ therapist: req.user._id })
      .sort({ createdAt: -1 })
      .populate("patient")
      .populate("therapist", "username")
      .exec();
    return res.send(soapNotesFound);
  } catch (err) {
    return res.status(500).send("Error fetching SOAP notes: " + err.message);
  }
});

// Get all SOAP notes (leader only)
router.get("/all", async (req, res) => {
  if (req.user.role !== "leader") return res.status(403).send("Access denied, leader only");
  try {
    let soapNotesFound = await SoapNote.find()
      .sort({ createdAt: -1 })
      .populate("patient")
      .populate("therapist", "username")
      .exec();
    return res.send(soapNotesFound);
  } catch (err) {
    return res.status(500).send("Error fetching SOAP notes: " + err.message);
  }
});

// Get SOAP by patient MRN and name
router.get("/search", async (req, res) => {
  // get q from query string
  const { q } = req.query;

  if (!q || q.trim().length < 1) {
    return res.send([]);
  }

  try {
    const searchRegex = new RegExp(q, "i");
    // Find patients matching the MRN or name
    const patientsFound = await Patient.find({
      $or: [{ name: searchRegex }, { medicalRecordNumber: searchRegex }],
    }).select("_id");

    // if no patients found, return empty array
    if (patientsFound.length === 0) {
      return res.send([]);
    }

    const patientIds = patientsFound.map((p) => p._id);

    // Find SOAP notes for the matching patients
    const noetsFound = await SoapNote.find({ patient: { $in: patientIds } })
      .populate("patient", "name medicalRecordNumber")
      .populate("therapist", "username")
      .sort({ treatmentDate: -1 });

    return res.send(noetsFound);
  } catch (err) {
    return res.status(500).send("Error searching SOAP notes: " + err.message);
  }
});

// Get a specific SOAP note by its ID
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let soapNoteFound = await SoapNote.findById(_id).populate("patient").populate("therapist", "username").exec();

    if (!soapNoteFound) return res.status(404).send("SOAP Note not found");
    return res.send(soapNoteFound);
  } catch (err) {
    return res.status(500).send("Error fetching SOAP note: " + err.message);
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
