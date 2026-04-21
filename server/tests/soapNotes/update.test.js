const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { SoapNote, Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("PATCH /api/soapNotes/:_id", () => {
  let testNoteId;
  let testTherapistId;

  beforeEach(async () => {
    const therapist = await User.create({ username: "drwu", password: "password", firstname: "Dr", lastname: "Wu" });
    const patient = await Patient.create({
      firstname: "Anna",
      lastname: "Lee",
      birthDate: "1990-01-01",
      gender: "female",
      phone: "123",
    });
    testTherapistId = therapist._id;

    const note = await SoapNote.create({
      patient: patient._id,
      therapist: therapist._id,
      disabilityCategory: "PT",
      sessionCount: 1,
      subjective: "Old subjective",
    });
    testNoteId = note._id;
  });

  it("should update a SOAP note successfully", async () => {
    const updateData = { subjective: "Updated subjective" };

    const response = await request(app)
      .patch(`/api/soapNotes/${testNoteId}`)
      .set("x-test-user-id", testTherapistId.toString())
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.updatedNote.subjective).toBe("Updated subjective");
  });

  it("should return 404 if SOAP note to update is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).patch(`/api/soapNotes/${fakeId}`).send({ subjective: "new" });

    expect(response.status).toBe(404);
  });
});
