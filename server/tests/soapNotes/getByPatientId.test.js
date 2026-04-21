const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { SoapNote, Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("GET /api/soapNotes/patient/:patientId", () => {
  let testPatientId;

  beforeEach(async () => {
    const therapist = await User.create({ username: "drwu", password: "password", firstname: "Dr", lastname: "Wu" });
    const patient = await Patient.create({
      firstname: "Anna",
      lastname: "Lee",
      birthDate: "1990-01-01",
      gender: "female",
      phone: "123",
    });
    testPatientId = patient._id;

    // Create 2 notes for this patient
    await SoapNote.create([
      { patient: testPatientId, therapist: therapist._id, disabilityCategory: "PT", sessionCount: 1 },
      { patient: testPatientId, therapist: therapist._id, disabilityCategory: "PT", sessionCount: 2 },
    ]);
  });

  it("should return notes for a specific patient", async () => {
    const response = await request(app).get(`/api/soapNotes/patient/${testPatientId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].sessionCount).toBeDefined();
  });

  it("should return empty array if patient has no notes", async () => {
    const fakePatientId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/soapNotes/patient/${fakePatientId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
