const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { Patient } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("GET /api/patients/:_id", () => {
  let testPatientId;

  // Create a patient before testing this specific suite
  beforeEach(async () => {
    const patient = await Patient.create({
      firstname: "Alice",
      lastname: "Wonderland",
      birthDate: "1992-02-02",
      gender: "female",
      phone: "0911222333",
    });
    testPatientId = patient._id;
  });

  it("should return a patient by valid ID", async () => {
    const response = await request(app).get(`/api/patients/${testPatientId}`);

    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe("Alice");
    expect(response.body._id).toBe(testPatientId.toString());
  });

  it("should return 404 if patient is not found", async () => {
    // Generate a valid ObjectId that does not exist in the database
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/patients/${fakeId}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Patient not found"); // Custom error message
  });

  it("should return 400 if ID format is invalid", async () => {
    const response = await request(app).get("/api/patients/invalid-id-format");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID format"); // Handled by CastError in errorHandler
  });
});
