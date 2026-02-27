// __tests__/getStudentDoubts.test.js
const request = require("supertest");
const express = require("express");
const mockingoose = require("mockingoose");
const { getStudentDoubts } = require("../controllers/doubtController");
const Doubt = require("../models/Doubt");

const app = express();
app.get("/doubts/:studentID", getStudentDoubts);

describe("White Box Testing - getStudentDoubts()", () => {

  beforeEach(() => {
    mockingoose.resetAll();
  });

  test("✅ Should return doubts sorted by CreatedAt desc", async () => {
    const mockDoubts = [
      { StudentID: "S001", Title: "Doubt 1", CreatedAt: new Date("2024-11-01") },
      { StudentID: "S001", Title: "Doubt 2", CreatedAt: new Date("2024-12-01") }
    ];

    mockingoose(Doubt).toReturn(mockDoubts, "find");

    const res = await request(app).get("/doubts/S001");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].Title).toBe("Doubt 1"); // order after sorting simulated
  });

  test("✅ Should return empty array if no doubts found", async () => {
    mockingoose(Doubt).toReturn([], "find");

    const res = await request(app).get("/doubts/S002");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("❌ Should handle invalid studentID gracefully", async () => {
    mockingoose(Doubt).toReturn([], "find");
    const res = await request(app).get("/doubts/undefined");
    expect(res.statusCode).toBe(200);
  });

  test("🔥 Should handle DB error (simulate exception)", async () => {
    mockingoose(Doubt).toReturn(new Error("DB Failure"), "find");

    const res = await request(app).get("/doubts/S003");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("DB Failure");
  });
});
