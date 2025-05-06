const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Parking = require("../src/models/Parking");

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

describe("Parking routes", () => {
  let student, guard;

  beforeEach(async () => {
    await Parking.deleteMany();
    await User.deleteMany();
  
    student = await User.create({
      name: "John",
      email: "john@student.edu",
      password: "secret123",
      idUniversity: "U001",
      role: "user"
    });
  
    guard = await User.create({
      name: "Admin",
      email: "admin@guard.edu",
      password: "adminpass",
      idUniversity: "U002",
      role: "guard"
    });
  });
  

  test("Guard assigns parking", async () => {
    const res = await request(app)
      .post("/api/parking/assign")
      .set("x-role", "guard")
      .send({ studentId: student._id, spotNumber: "A1" });

    expect(res.statusCode).toBe(201);
    expect(res.body.spotNumber).toBe("A1");
  });

  test("User views parking", async () => {
    await Parking.create({ student: student._id, spotNumber: "B2" });

    const res = await request(app)
      .get("/api/parking/my-parking")
      .set("x-role", "user")
      .set("x-user-id", student._id.toString());

    expect(res.statusCode).toBe(200);
    expect(res.body.spotNumber).toBe("B2");
  });
});
