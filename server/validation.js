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

const patientValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    birthDate: Joi.date().required(),
    gender: Joi.string().required().valid("male", "female", "other"),
  });
  return schema.validate(data);
};

const updatePatientValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100),
    birthDate: Joi.date(),
    gender: Joi.string().valid("male", "female", "other"),
    // contactNumber: Joi.string().allow(""),
    // address: Joi.string().allow(""),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.soapNoteValidation = soapNoteValidation;
module.exports.patientValidation = patientValidation;
module.exports.updatePatientValidation = updatePatientValidation;
