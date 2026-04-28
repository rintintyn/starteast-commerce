const request = require("supertest");
let expect;

const API_URL = process.env.API_BASE_URL || "http://localhost:3000";

describe("API path coverage", () => {
  let authToken;

  before(async () => {
    ({ expect } = await import("chai"));
    const res = await request(API_URL)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "alex@stareast.com", password: "password123" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    authToken = res.body.token;
  });

  it("POST /login returns token for valid user", async () => {
    const res = await request(API_URL)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "alex@stareast.com", password: "password123" });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.nested.property("user.email", "alex@stareast.com");
  });

  it("POST /register registers a new user", async () => {
    const res = await request(API_URL)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Sam Rivera",
        email: "sam@stareast.com",
        password: "password123",
      });

    expect([201, 409]).to.include(res.status);
    if (res.status === 201) {
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.nested.property(
        "user.email",
        "sam@stareast.com"
      );
    }
  });

  it("POST /checkout completes a cash checkout", async () => {
    const res = await request(API_URL)
      .post("/checkout")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ paymentMethod: "cash", items: [{ productId: 1, quantity: 1 }] });

    expect(res.status).to.equal(200);
    expect(res.body).to.include({ paymentMethod: "cash" });
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("items").that.is.an("array");
  });

  it("GET /healthcheck returns ok status", async () => {
    const res = await request(API_URL).get("/healthcheck");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "ok");
  });
}); 
