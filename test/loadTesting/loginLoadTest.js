import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const scenarios = new SharedArray("login scenarios", () => [
  {
    name: "valid-alex",
    payload: { email: "alex@stareast.com", password: "password123" },
    expectedStatus: 200,
    expectToken: true,
  },
  {
    name: "valid-jamie",
    payload: { email: "jamie@stareast.com", password: "password123" },
    expectedStatus: 200,
    expectToken: true,
  },
  {
    name: "valid-taylor",
    payload: { email: "taylor@stareast.com", password: "password123" },
    expectedStatus: 200,
    expectToken: true,
  },
  {
    name: "invalid-password",
    payload: { email: "alex@stareast.com", password: "wrongpass" },
    expectedStatus: 401,
    expectToken: false,
  },
  {
    name: "missing-password",
    payload: { email: "jamie@stareast.com" },
    expectedStatus: 400,
    expectToken: false,
  },
  {
    name: "missing-email",
    payload: { password: "password123" },
    expectedStatus: 400,
    expectToken: false,
  },
  {
    name: "empty-values",
    payload: { email: "", password: "" },
    expectedStatus: 400,
    expectToken: false,
  },
]);

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "20s", target: 30 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    "http_req_duration{endpoint:login}": ["p(95)<500"],
  },
};

export default function () {
  const scenario = scenarios[(__VU - 1 + __ITER) % scenarios.length];
  const payload = JSON.stringify(scenario.payload);
  const params = {
    headers: { "Content-Type": "application/json" },
    tags: { endpoint: "login", scenario: scenario.name },
  };

  const response = http.post(`${BASE_URL}/login`, payload, params);

  check(response, {
    "status matches expected": (res) => res.status === scenario.expectedStatus,
    "token presence matches": (res) =>
      scenario.expectToken ? Boolean(res.json("token")) : !res.json("token"),
  });

  sleep(1);
}
