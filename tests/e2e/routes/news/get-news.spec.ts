import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Get news", () => {
  test("should to be able to get news by page number", async () => {
    const res = await request(app).get("/api/v1/news").query({
      pageNumber: 0,
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("value");
    expect(res.body.value.length).toBeGreaterThan(0);

    res.body.value.forEach((value: any) => {
      expect(value).toHaveProperty("text");
      expect(value).toHaveProperty("link");
      expect(value).toHaveProperty("date");
    });
  }, 40000);

  test("should to be able to get news by page number and title", async () => {
    const res = await request(app).get("/api/v1/news").query({
      pageNumber: 0,
      title: "Teste",
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("value");
    expect(res.body.value.length).toBeGreaterThan(0);

    res.body.value.forEach((value: any) => {
      expect(value).toHaveProperty("text");
      expect(value).toHaveProperty("link");
      expect(value).toHaveProperty("date");
    });
  }, 40000);

  test("shouldn't to be able to get news when title not exists", async () => {
    const res = await request(app).get("/api/v1/news").query({
      pageNumber: 0,
      title: "----------",
    });
    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.status).toBe(200);

    console.log(res.body);

    expect(res.body.value).toStrictEqual({});
  }, 40000);

  test("shouldn't to be able to get news when page number not exists", async () => {
    const res = await request(app).get("/api/v1/news").query({
      pageNumber: 100000000,
    });
    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.status).toBe(200);

    console.log(res.body);

    expect(res.body.value).toStrictEqual({});
  }, 40000);
});
