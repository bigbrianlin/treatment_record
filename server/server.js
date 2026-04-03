const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);

const authRoute = require("./routes").auth;
const patientRoute = require("./routes").patients;
const soapNoteRoute = require("./routes").soapNotes;
const adminRoute = require("./routes").admin;
const usersRoute = require("./routes").users;

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

// connect to database
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
    process.exit(1);
  });

// routes
app.use("/api/auth", authRoute);
app.use("/api/patients", passport.authenticate("jwt", { session: false }), patientRoute);
app.use("/api/soapNotes", passport.authenticate("jwt", { session: false }), soapNoteRoute);
app.use("/api/admin", passport.authenticate("jwt", { session: false }), adminRoute);
app.use("/api/users", passport.authenticate("jwt", { session: false }), usersRoute);
