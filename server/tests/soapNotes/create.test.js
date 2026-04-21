const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("POST /api/soapNotes", () => {
  let testPatientId;
  let testTherapistId;

  beforeEach(async () => {
    // Create a mock therapist
    const therapist = await User.create({
      username: "drsmith",
      password: "password123",
      firstname: "John",
      lastname: "Smith",
      role: "therapist",
    });
    testTherapistId = therapist._id;

    // Create a mock patient
    const patient = await Patient.create({
      firstname: "Tom",
      lastname: "Holland",
      birthDate: "1996-06-01",
      gender: "male",
      phone: "0911222333",
    });
    testPatientId = patient._id;
  });

  it("should create a new SOAP note successfully", async () => {
    const newNote = {
      patient: testPatientId.toString(),
      disabilityCategory: "Orthopedic",
      treatmentDate: "2024-03-15",
      sessionCount: 1,
      subjective: "Patient complains of back pain.",
      objective: "ROM limited in lumbar flexion.",
      assessment: "Muscle strain.",
      plan: "Hot pack and gentle stretching.",
    };

    const response = await request(app)
      .post("/api/soapNotes")
      .set("x-test-user-id", testTherapistId.toString()) // Mock logged-in user
      .send(newNote);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("SOAP note created successfully");
    expect(response.body.savedNote.disabilityCategory).toBe("Orthopedic");
    expect(response.body.savedNote.therapist).toBe(testTherapistId.toString());
  });

  it("should return 400 if validation fails", async () => {
    const invalidNote = { sessionCount: 1 }; // Missing required fields

    const response = await request(app)
      .post("/api/soapNotes")
      .set("x-test-user-id", testTherapistId.toString())
      .send(invalidNote);

    expect(response.status).toBe(400);
  });

  it("should return 404 if patient is not found", async () => {
    const fakePatientId = new mongoose.Types.ObjectId();
    const noteData = {
      patient: fakePatientId.toString(),
      disabilityCategory: "Neuro",
      sessionCount: 2,
      treatmentDate: "2024-03-15",
    };

    const response = await request(app)
      .post("/api/soapNotes")
      .set("x-test-user-id", testTherapistId.toString())
      .send(noteData);

    expect(response.status).toBe(404);
  });
});
