const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { SoapNote, Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("DELETE /api/soapNotes/:_id", () => {
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
      sessionCount: 1,
    });
    testNoteId = note._id;
  });

  it("should delete a SOAP note successfully", async () => {
    const response = await request(app).delete(`/api/soapNotes/${testNoteId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("SOAP note deleted successfully");

    const checkNote = await SoapNote.findById(testNoteId);
    expect(checkNote).toBeNull();
  });

  it("should return 404 if SOAP note to delete is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/soapNotes/${fakeId}`);

    expect(response.status).toBe(404);
  });
});
