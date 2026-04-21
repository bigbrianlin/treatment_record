const { SoapNote, Patient } = require("../models");
const { soapNoteValidation, updateSoapNoteValidation } = require("../validation");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Get all SOAP notes
 * @route   GET /api/soap-notes
 */
const getAllSoapNotes = catchAsync(async (req, res, next) => {
  const notes = await SoapNote.find()
    .populate("patient", "firstname lastname medicalRecordNumber")
    .populate("therapist", "username")
    .sort({ createdAt: -1 });

  res.status(200).json(notes);
});

/**
 * @desc    Get a specific SOAP note by ID
 * @route   GET /api/soap-notes/:_id
 */
const getSoapNoteById = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const note = await SoapNote.findById(_id).populate("patient").populate("therapist", "username");

  if (!note) {
    const error = new Error("SOAP note not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json(note);
});

/**
 * @desc    Get all SOAP notes for a specific patient
 * @route   GET /api/soap-notes/patient/:patientId
 */
const getNotesByPatientId = catchAsync(async (req, res, next) => {
  const { patientId } = req.params;
  const notes = await SoapNote.find({ patient: patientId }).populate("therapist", "username").sort({ date: -1 });

  res.status(200).json(notes);
});

/**
 * @desc    Create a new SOAP note
 * @route   POST /api/soap-notes
 */
const createSoapNote = catchAsync(async (req, res, next) => {
  // Joi validation
  const { error } = soapNoteValidation(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  // Check if patient exists
  const patientExists = await Patient.findById(req.body.patient);
  if (!patientExists) {
    const err = new Error("Cannot create note: Patient not found");
    err.statusCode = 404;
    throw err;
  }

  const newNote = new SoapNote({
    ...req.body,
    therapist: req.user._id, // Set the current logged-in user as therapist
  });

  const savedNote = await newNote.save();
  res.status(201).json({
    message: "SOAP note created successfully",
    savedNote,
  });
});

/**
 * @desc    Update an existing SOAP note
 * @route   PATCH /api/soap-notes/:_id
 */
const updateSoapNote = catchAsync(async (req, res, next) => {
  // Joi validation
  const { error } = updateSoapNoteValidation(req.body);
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    throw err;
  }

  const { _id } = req.params;
  const updatedNote = await SoapNote.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

  if (!updatedNote) {
    const err = new Error("Update failed: SOAP note not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: "SOAP note updated successfully",
    updatedNote,
  });
});

/**
 * @desc    Delete a SOAP note
 * @route   DELETE /api/soap-notes/:_id
 */
const deleteSoapNote = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const deletedNote = await SoapNote.findByIdAndDelete(_id);

  if (!deletedNote) {
    const err = new Error("Delete failed: SOAP note not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    message: "SOAP note deleted successfully",
    id: _id,
  });
});

module.exports = {
  getAllSoapNotes,
  getSoapNoteById,
  getNotesByPatientId,
  createSoapNote,
  updateSoapNote,
  deleteSoapNote,
};
