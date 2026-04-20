// tests/patients/update.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { Patient } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("PATCH /api/patients/:_id", () => {
  let testPatientId;

  beforeEach(async () => {
    const patient = await Patient.create({
      firstname: "Bob",
      lastname: "Builder",
      birthDate: "1980-03-03",
      gender: "male",
      phone: "0955666777",
    });
    testPatientId = patient._id;
  });

  it("should update a patient successfully", async () => {
    const updateData = { phone: "0988999000", address: "New City" };

    const response = await request(app).patch(`/api/patients/${testPatientId}`).send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Patient updated successfully");
    expect(response.body.updatedPatient.phone).toBe("0988999000");
    expect(response.body.updatedPatient.address).toBe("New City");
    // Ensure original data is kept
    expect(response.body.updatedPatient.firstname).toBe("Bob");
  });

  it("should return 400 if validation fails", async () => {
    // Attempting to update gender to an invalid enum value
    const updateData = { gender: "alien" };

    const response = await request(app).patch(`/api/patients/${testPatientId}`).send(updateData);

    expect(response.status).toBe(400);
  });

  it("should return 404 if patient is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const updateData = { phone: "12345" };

    const response = await request(app).patch(`/api/patients/${fakeId}`).send(updateData);

    expect(response.status).toBe(404);
  });
});
