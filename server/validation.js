const Joi = require("joi");

// Registration validation schema
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required(),
    role: Joi.string().required().valid("leader", "member"),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const soapNoteValidation = (data) => {
  const schema = Joi.object({
    patient: Joi.string().hex().length(24).required(),
    disabilityCategory: Joi.string().max(100).required(),
    treatmentDate: Joi.date().required(),
    sessionCount: Joi.number().min(1).required(),
    subjective: Joi.string().allow("").optional(),
    objective: Joi.string().allow("").optional(),
    assessment: Joi.string().allow("").optional(),
    plan: Joi.string().allow("").optional(),
  });
  return schema.validate(data);
};

const updateSoapNoteValidation = (data) => {
  const schema = Joi.object({
    patient: Joi.string().hex().length(24),
    disabilityCategory: Joi.string().max(100),
    treatmentDate: Joi.date(),
    sessionCount: Joi.number().min(1),
    subjective: Joi.string().allow("").optional(),
    objective: Joi.string().allow("").optional(),
    assessment: Joi.string().allow("").optional(),
    plan: Joi.string().allow("").optional(),
  });
  return schema.validate(data);
};

const patientValidation = (data) => {
  const schema = Joi.object({
    // Basic Information (Required fields)
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    phone: Joi.string().max(20).required(),

    // Optional Information
    // allow("", null) prevents validation errors when the frontend sends empty strings
    nationalId: Joi.string().allow("", null).optional(),
    email: Joi.string().email().allow("", null).optional(),
    address: Joi.string().allow("", null).optional(),

    // Nested Object for Emergency Contact
    emergencyContact: Joi.object({
      name: Joi.string().allow("", null).optional(),
      relationship: Joi.string().allow("", null).optional(),
      phone: Joi.string().allow("", null).optional(),
    }).optional(),

    // Medical Background
    allergies: Joi.array().items(Joi.string()).optional(),
    medicalHistory: Joi.string().allow("", null).optional(),

    // Administrative Control
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

const updatePatientValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().max(50).optional(),
    lastname: Joi.string().max(50).optional(),
    birthDate: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    phone: Joi.string().max(20).optional(),
    nationalId: Joi.string().allow("", null).optional(),
    email: Joi.string().email().allow("", null).optional(),
    address: Joi.string().allow("", null).optional(),
    emergencyContact: Joi.object({
      name: Joi.string().allow("", null).optional(),
      relationship: Joi.string().allow("", null).optional(),
      phone: Joi.string().allow("", null).optional(),
    }).optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    medicalHistory: Joi.string().allow("", null).optional(),
    isActive: Joi.boolean().optional(),
  });

  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.soapNoteValidation = soapNoteValidation;
module.exports.updateSoapNoteValidation = updateSoapNoteValidation;
module.exports.patientValidation = patientValidation;
module.exports.updatePatientValidation = updatePatientValidation;
