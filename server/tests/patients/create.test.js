// tests/patients/create.test.js
const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");

const app = createTestApp();

// Database lifecycle hooks
beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("POST /api/patients", () => {
  it("should create a new patient successfully", async () => {
    const newPatient = {
      firstname: "John",
      lastname: "Doe",
      birthDate: "1990-01-01",
      gender: "male",
      phone: "0912345678",
    };

    const response = await request(app).post("/api/patients").send(newPatient);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Patient created successfully");
    expect(response.body.savedPatient.firstname).toBe("John");
  });

  it("should return 400 if required fields are missing", async () => {
    const invalidPatient = {
      firstname: "John",
      // Missing other required fields
    };

    const response = await request(app).post("/api/patients").send(invalidPatient);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
