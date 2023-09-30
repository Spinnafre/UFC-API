import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Get highlights news", () => {
  test("should to be able to get highlights news", async () => {
    const res = await request(app).get("/api/v1/news/highlightsNews");

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("value");

    expect(res.body.value).toHaveProperty("highlight");
    expect(res.body.value).toHaveProperty("latestNews");
    expect(res.body.value).toHaveProperty("extra");
  }, 40000);
});
