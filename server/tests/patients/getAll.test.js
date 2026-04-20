// tests/patients/getAll.test.js
const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { Patient } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("GET /api/patients", () => {
  it("should return an empty array if no patients exist", async () => {
    const response = await request(app).get("/api/patients");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it("should return a list of patients", async () => {
    // 1. Seed the database with a test patient
    await Patient.create({
      firstname: "Jane",
      lastname: "Smith",
      birthDate: "1985-05-15",
      gender: "female",
      phone: "0987654321",
    });

    // 2. Fetch patients via API
    const response = await request(app).get("/api/patients");

    // 3. Assertions
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].firstname).toBe("Jane");
  });
});
