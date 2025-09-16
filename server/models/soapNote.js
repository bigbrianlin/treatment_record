const mongoose = require("mongoose");
const { Schema } = mongoose;

const soapNoteSchema = new Schema(
  {
    // ----  ----
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    therapist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Therapist reference is required"],
    },

    // ---- Treatment Information ----
    disabilityCategory: {
      type: String,
      required: [true, "Disability category is required"],
      trim: true,
      // enum: ["category1", "category2", "category3"], // Add actual categories as needed
    },
    treatmentDate: {
      type: Date,
      required: [true, "Treatment date is required"],
      default: Date.now,
    },
    sessionCount: {
      type: Number,
      required: [true, "Session count is required"],
      min: [1, "Session count must be at least 1"],
    },

    // ---- SOAP Note Sections ----
    subjective: {
      type: String,
      trim: true,
    },
    objective: {
      type: String,
      trim: true,
    },
    assessment: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SoapNote = mongoose.model("SoapNote", soapNoteSchema);
module.exports = SoapNote;
