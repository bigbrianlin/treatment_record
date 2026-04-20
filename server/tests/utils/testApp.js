const express = require("express");
const errorHandler = require("../../middlewares/errorHandler");

// Import routers
const patientRouter = require("../../routes/patients");
// You can import soapNotesRouter later

/**
 * Creates and configures an Express application for testing.
 * @returns {Object} Configured Express app
 */
const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());

  // Mount routes
  app.use("/api/patients", patientRouter);

  // Global error handler must be at the end
  app.use(errorHandler);

  return app;
};

module.exports = createTestApp;
