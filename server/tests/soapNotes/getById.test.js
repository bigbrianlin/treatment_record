const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { SoapNote, Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("GET /api/soapNotes/:_id", () => {
  let testNoteId;

  beforeEach(async () => {
    const therapist = await User.create({ username: "drwu", password: "password", firstname: "Dr", lastname: "Wu" });
    const patient = await Patient.create({
      firstname: "Anna",
      lastname: "Lee",
      birthDate: "1990-01-01",
      gender: "female",
      phone: "123",
    });

    const note = await SoapNote.create({
      patient: patient._id,
      therapist: therapist._id,
      disabilityCategory: "PT",
      sessionCount: 3,
      assessment: "Improving.",
    });
    testNoteId = note._id;
  });

  it("should return a SOAP note by valid ID", async () => {
    const response = await request(app).get(`/api/soapNotes/${testNoteId}`);
    expect(response.status).toBe(200);
    expect(response.body.assessment).toBe("Improving.");
  });

  it("should return 404 if SOAP note is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/soapNotes/${fakeId}`);
    expect(response.status).toBe(404);
  });
});
