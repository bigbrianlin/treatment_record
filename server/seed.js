require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("./models");

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_PASSWORD = process.env.INITIAL_ADMIN_PASSWORD;

const seedAdmin = async () => {
  try {
    // Check if the password is provided in the environment
    if (!ADMIN_PASSWORD) {
      throw new Error("INITIAL_ADMIN_PASSWORD is not defined in .env file");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");

    // await User.deleteMany({});
    // console.log("Cleared existing users collection");

    const adminUser = new User({
      username: "superadmin",
      password: ADMIN_PASSWORD,
      role: "admin",
      firstname: "System",
      lastname: "Admin",
      isActive: true,
      mustChangePassword: false,
    });

    await adminUser.save();
    console.log("Super admin created successfully!");
  } catch (error) {
    console.error("Error creating super admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedAdmin();
