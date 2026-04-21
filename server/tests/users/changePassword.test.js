const request = require("supertest");
const { connectDB, clearDB, closeDB } = require("../utils/db");
const createTestApp = require("../utils/testApp");
const { User } = require("../../models");

const app = createTestApp();

beforeAll(async () => await connectDB());
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("User API: Change Password", () => {
  let testUserId;

  beforeEach(async () => {
    const user = await User.create({
      username: "testdoc",
      password: "oldPassword123",
      role: "therapist",
      firstname: "Test",
      lastname: "Doc",
    });
    testUserId = user._id.toString();
  });

  it("should update password successfully", async () => {
    const response = await request(app)
      .put("/api/users/change-password")
      .set("x-test-user-id", testUserId)
      .send({ oldPassword: "oldPassword123", newPassword: "newPassword456" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password updated successfully.");
  });

  it("should return 400 if old password is incorrect", async () => {
    const response = await request(app)
      .put("/api/users/change-password")
      .set("x-test-user-id", testUserId)
      .send({ oldPassword: "wrongPassword", newPassword: "newPassword456" });

    expect(response.status).toBe(400);
  });
});
