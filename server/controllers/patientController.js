// controllers/patientController.js
const { Patient } = require("../models");
const { patientValidation, updatePatientValidation } = require("../validation");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Get all patients
 * @route   GET /api/patients
 */
const getAllPatients = catchAsync(async (req, res, next) => {
  const patients = await Patient.find().sort({ createdAt: -1 });
  res.status(200).json(patients);
});

/**
 * @desc    Get a specific patient by ID
 * @route   GET /api/patients/:_id
 */
const getPatientById = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const patient = await Patient.findById(_id);

  if (!patient) {
    const error = new Error("Patient not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(patient);
});

/**
 * @desc    Create a new patient
 * @route   POST /api/patients
 */
const createPatient = catchAsync(async (req, res, next) => {
  // Joi validation
  const { error } = patientValidation(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const newPatient = new Patient(req.body);
  const savedPatient = await newPatient.save();

  res.status(201).json({
    message: "Patient created successfully",
    savedPatient,
  });
});

/**
 * @desc    Update an existing patient
 * @route   PATCH /api/patients/:_id
 */
const updatePatient = catchAsync(async (req, res, next) => {
  // Joi validation
  const { error } = updatePatientValidation(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { _id } = req.params;
  const updatedPatient = await Patient.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

  if (!updatedPatient) {
    const err = new Error("Update failed: Patient not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: "Patient updated successfully",
    updatedPatient,
  });
});

/**
 * @desc    Delete a patient (or soft delete by setting isActive: false)
 * @route   DELETE /api/patients/:_id
 */
const deletePatient = catchAsync(async (req, res, next) => {
  const { _id } = req.params;

  // You can choose to hard delete or change to soft delete here
  const deletedPatient = await Patient.findByIdAndDelete(_id);

  if (!deletedPatient) {
    const err = new Error("Delete failed: Patient not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: "Patient deleted successfully",
    id: _id,
  });
});

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
