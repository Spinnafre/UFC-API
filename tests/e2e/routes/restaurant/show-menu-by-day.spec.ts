import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Show menu by day", () => {
  // beforeEach(() => {
  //   jest.resetAllMocks();
  // });

  test("should to be able to get restaurant menu when date is valid", async () => {
    const res = await request(app).get("/api/v1/restaurant/menu").query({
      date: "2023-09-05",
    });
    console.log(res.headers);

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("value");
    expect(res.body.value).toHaveLength(3);

    res.body.value.forEach((value: any) => {
      expect(value).toHaveProperty("type");
      expect(value).toHaveProperty("meat");
      expect(value.meat.length).toBeGreaterThan(0);
    });
  }, 40000);

  test("shouldn't to be able to get restaurant menu when date is invalid format", async () => {
    const res = await request(app).get("/api/v1/restaurant/menu").query({
      date: "3/0/05",
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      message: '"date" must be in ISO 8601 date format',
    });
  }, 40000);

  test("shouldn't to be able to get restaurant menu when date is not exists", async () => {
    const res = await request(app).get("/api/v1/restaurant/menu").query({
      date: "",
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      message: '"date" must be in ISO 8601 date format',
    });
  }, 40000);
});
