// tests/utils/testApp.js
const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");

// Import routers
const patientRouter = require("../../routes/patients");
const soapNoteRouter = require("../../routes/soapNotes");

const createTestApp = () => {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    if (req.headers["x-test-user-id"]) {
      req.user = {
        _id: req.headers["x-test-user-id"],
        role: "therapist",
        username: "testtherapist",
      };
    }
    next();
  });

  // Mount routes
  app.use("/api/patients", patientRouter);
  app.use("/api/soapNotes", soapNoteRouter);

  // Global error handler
  app.use(errorHandler);

  return app;
};

module.exports = createTestApp;
