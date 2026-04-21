const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Auth API Tests", () => {
  it("should login successfully and return a token", async () => {
    // Seed a valid user for login
    await User.create({
      username: "loginuser",
      password: "password123",
      role: "admin",
      firstname: "Login",
      lastname: "User",
      isActive: true,
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "loginuser", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("should block login if account is deactivated", async () => {
    // Seed an inactive user
    await User.create({
      username: "baduser",
      password: "password123",
      role: "therapist",
      firstname: "Bad",
      lastname: "User",
      isActive: false,
    });

    const response = await request(app).post("/api/auth/login").send({ username: "baduser", password: "password123" });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
