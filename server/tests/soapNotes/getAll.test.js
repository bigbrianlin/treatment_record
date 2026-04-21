const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { SoapNote, Patient, User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("GET /api/soapNotes", () => {
  it("should return an empty array if no SOAP notes exist", async () => {
    const response = await request(app).get("/api/soapNotes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("should return populated SOAP notes", async () => {
    const therapist = await User.create({ username: "drwu", password: "password", firstname: "Dr", lastname: "Wu" });
    const patient = await Patient.create({
      firstname: "Anna",
      lastname: "Lee",
      birthDate: "1990-01-01",
      gender: "female",
      phone: "123",
    });

    await SoapNote.create({
      patient: patient._id,
      therapist: therapist._id,
      disabilityCategory: "General",
      sessionCount: 1,
    });

    const response = await request(app).get("/api/soapNotes");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].patient.firstname).toBe("Anna"); // Check population
    expect(response.body[0].therapist.username).toBe("drwu");
  });
});
