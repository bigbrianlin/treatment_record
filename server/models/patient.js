const mongoose = require("mongoose");
const { Schema } = mongoose;
const Counter = require("./counter");

const patientSchema = new Schema(
  {
    medicalRecordNumber: {
      type: String,
      unique: true,
    },
    // ---- Patient Basic Information ----
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
      trim: true,
    },
    birthDate: {
      type: Date,
      required: [true, "Birth date is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    nationalId: {
      type: String,
      trim: true,
    },

    // ---- Contact Information ----
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: { type: String, trim: true },
    address: { type: String },

    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
    // Medical Background
    allergies: [{ type: String }], // Array of strings for multiple allergies
    medicalHistory: { type: String }, // Can be a text area for general notes

    // Administrative Control
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for age calculation
patientSchema.virtual("age").get(function () {
  if (!this.birthDate) return null;

  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
});

patientSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  try {
    let counter = await Counter.findByIdAndUpdate(
      "patients",
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const seq = counter.seq;
    const sequenceNumber = 10000 + seq;

    // Format: MRN-YYYYMM-XXXXX
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    this.medicalRecordNumber = `MRN-${year}${month}-${sequenceNumber}`;
    next();
  } catch (err) {
    return next(err);
  }
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
