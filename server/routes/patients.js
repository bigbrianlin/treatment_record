const router = require("express").Router();
const { Patient } = require("../models");
const patientValidation = require("../validation").patientValidation;

// Middleware to log requests to this router
router.use((req, res, next) => {
  console.log("Patient middleware");
  next();
});

// Test API endpoint
// router.get("/testAPI", (req, res) => {
//   return res.send("Patient API is working properly");
// });

// get all patients
router.get("/", async (req, res) => {
  try {
    let patients = await Patient.find().sort({ createdAt: -1 });
    return res.send(patients);
  } catch (err) {
    return res.status(500).send("Error fetching patients: " + err.message);
  }
});

// Get a specific patient by ID
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let patientFound = await Patient.findById(_id);

    if (!patientFound) return res.status(404).send("Patient not found");
    return res.send(patientFound);
  } catch (err) {
    return res.status(500).send("Error fetching patient: " + err.message);
  }
});

// Create a new patient
router.post("/", async (req, res) => {
  // validate the patient data here if needed
  let { error } = patientValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { name, birthDate, gender } = req.body;
  try {
    let newPatient = new Patient({
      name,
      birthDate,
      gender,
    });
    let savedPatient = await newPatient.save();
    return res.status(210).send({ message: "Patient created successfully", savedPatient });
  } catch (err) {
    console.log("Error creating patient:", err);
    if (err.code === 11000) {
      return res.status(400).send("Medical Record Number already exists");
    }
    return res.status(500).send("Error creating patient: " + err.message);
  }
});

module.exports = router;
