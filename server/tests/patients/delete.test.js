// tests/patients/delete.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { Patient } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("DELETE /api/patients/:_id", () => {
  let testPatientId;

  beforeEach(async () => {
    const patient = await Patient.create({
      firstname: "Charlie",
      lastname: "Chaplin",
      birthDate: "1889-04-16",
      gender: "male",
      phone: "0912345678",
    });
    testPatientId = patient._id;
  });

  it("should delete a patient successfully", async () => {
    const response = await request(app).delete(`/api/patients/${testPatientId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Patient deleted successfully");
    expect(response.body.id).toBe(testPatientId.toString());

    // Verify it is actually removed from database
    const checkPatient = await Patient.findById(testPatientId);
    expect(checkPatient).toBeNull();
  });

  it("should return 404 if patient to delete is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/patients/${fakeId}`);

    expect(response.status).toBe(404);
  });

  it("should return 400 if ID format is invalid", async () => {
    const response = await request(app).delete("/api/patients/not-an-id");

    expect(response.status).toBe(400);
  });
});
