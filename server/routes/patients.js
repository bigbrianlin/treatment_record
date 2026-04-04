const router = require("express").Router();
const { Patient } = require("../models");
const patientValidation = require("../validation").patientValidation;
const updatePatientValidation = require("../validation").updatePatientValidation;

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
    const patients = await Patient.find().sort({ createdAt: -1 });
    return res.json(patients);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching patients: " + err.message });
  }
});

// Get a specific patient by ID
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const patientFound = await Patient.findById(_id);

    if (!patientFound) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.json(patientFound);
  } catch (err) {
    // Handle invalid MongoDB ObjectId format (CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    return res.status(500).json({ message: "Error fetching patient: " + err.message });
  }
});

// Create a new patient
router.post("/", async (req, res) => {
  // validate the patient data here if needed
  const { error } = patientValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const {
    firstname,
    lastname,
    birthDate,
    gender,
    nationalId,
    phone,
    email,
    address,
    emergencyContact,
    allergies,
    medicalHistory,
  } = req.body;

  try {
    const newPatient = new Patient({
      firstname,
      lastname,
      birthDate,
      gender,
      nationalId,
      phone,
      email,
      address,
      emergencyContact,
      allergies,
      medicalHistory,
    });

    const savedPatient = await newPatient.save();

    return res.status(201).json({
      message: "Patient created successfully",
      savedPatient,
    });
  } catch (err) {
    console.log("Error creating patient:", err);

    if (err.code === 11000) {
      return res.status(400).json({ message: "Medical Record Number already exists" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Error creating patient: " + err.message });
  }
});

// Edit an existing patients
router.patch("/:_id", async (req, res) => {
  const { error } = updatePatientValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { _id } = req.params;
  const updateData = req.body;

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.json({
      message: "Patient updated successfully",
      updatedPatient,
    });
  } catch (err) {
    console.log("Error updating patient:", err);

    // Handle invalid MongoDB ObjectId format (CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Error updating patient: " + err.message });
  }
});

// Delete a patient
router.delete("/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedPatient = await Patient.findByIdAndDelete(_id);
    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    return res.json({
      message: "Patient deleted successfully",
      deletedPatient,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    return res.status(500).json({ message: "Error deleting patient: " + err.message });
  }
});

module.exports = router;
