const request = require("supertest");
const mongoose = require("mongoose");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Admin API Tests", () => {
  let adminId;

  beforeEach(async () => {
    const admin = await User.create({
      username: "adminUser",
      password: "password123",
      role: "admin",
      firstname: "Admin",
      lastname: "User",
    });
    adminId = admin._id.toString();
  });

  it("should return 403 if user is not an admin", async () => {
    const response = await request(app)
      .get("/api/admin/users")
      .set("x-test-user-id", new mongoose.Types.ObjectId().toString())
      .set("x-test-user-role", "therapist"); // Not an admin!

    expect(response.status).toBe(403);
  });

  it("should create a new user when requested by an admin", async () => {
    const newUser = {
      username: "drlee",
      role: "therapist",
      firstname: "Bruce",
      lastname: "Lee",
    };

    const response = await request(app)
      .post("/api/admin/users")
      .set("x-test-user-id", adminId)
      .set("x-test-user-role", "admin")
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe("drlee");
  });
});
