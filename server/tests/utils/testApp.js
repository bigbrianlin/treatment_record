const express = require("express");
const cookieParser = require("cookie-parser");
const errorHandler = require("../../middlewares/errorHandler");

const patientRouter = require("../../routes/patients");
const soapNoteRouter = require("../../routes/soapNotes");
const authRouter = require("../../routes/auth");
const adminRouter = require("../../routes/admin");
const userRouter = require("../../routes/users");

const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // Mock Authentication Middleware
  app.use((req, res, next) => {
    if (req.headers["x-test-user-id"]) {
      req.user = {
        _id: req.headers["x-test-user-id"],
        role: req.headers["x-test-user-role"] || "therapist",
        username: "testuser",
      };
    }
    next();
  });

  // Mount routes
  app.use("/api/patients", patientRouter);
  app.use("/api/soapNotes", soapNoteRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/users", userRouter);

  app.use(errorHandler);

  return app;
};

module.exports = createTestApp;
