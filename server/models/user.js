const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    // Authentication fields
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [255, "Password cannot exceed 50 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "therapist", "receptionist"],
      default: "therapist",
      required: [true, "Role is required"],
    },

    // Personal Information
    email: { type: String },
    firstname: { type: String, required: [true, "Firstname is required"] },
    lastname: { type: String, required: [true, "Lastname is required"] },
    phoneNumber: { type: String },

    // Professional Information
    licenseId: { type: String },
    specialization: { type: String },
    title: { type: String },

    // Account Control
    isActive: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true },
    lastLoginAt: { type: Date },

    refreshToken: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// instance method
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
