const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/User");

beforeAll(async () => {
  await mongoose.connect("mongodb+srv://eltcarlosfn:1b8NqfW7BeaFYkBa@cluster0.6rygg.mongodb.net/parking?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Auth routes", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  test("Register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@example.com",
      password: "mypassword",
      idUniversity: "UNI123",
      role: "user"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  test("Login with valid credentials", async () => {
    // Register first
    await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@example.com",
      password: "mypassword",
      idUniversity: "UNI123",
      role: "user"
    });

    // Then login
    const res = await request(app).post("/api/auth/login").send({
      email: "carlos@example.com",
      password: "mypassword"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.role).toBe("user");
  });

  test("Login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Carlos",
      email: "carlos@example.com",
      password: "mypassword",
      idUniversity: "UNI123",
      role: "user"
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "carlos@example.com",
      password: "wrongpassword"
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  test("Change role by guard", async () => {
    // Create a user
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Ana",
      email: "ana@example.com",
      password: "password123",
      idUniversity: "UNI789",
      role: "user"
    });

    const userId = userRes.body.userId;

    const res = await request(app)
      .patch(`/api/auth/changerole/${userId}`)
      .set("x-role", "guard")
      .send({ role: "guard" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.role).toBe("guard");
  });

  test("Change role denied to user", async () => {
    const userRes = await request(app).post("/api/auth/register").send({
      name: "Ana",
      email: "ana@example.com",
      password: "password123",
      idUniversity: "UNI789",
      role: "user"
    });

    const res = await request(app)
      .patch(`/api/auth/changerole/${userRes.body.userId}`)
      .set("x-role", "user")
      .send({ role: "guard" });

    expect(res.statusCode).toBe(403);
  });
});
