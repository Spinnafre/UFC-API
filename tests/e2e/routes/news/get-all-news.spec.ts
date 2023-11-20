import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Get all news", () => {
  test("should to be able to get news from domain by title and page number", async () => {
    const res = await request(app).get("/api/v1/news/all").query({
      pageNumber: 1,
      title: "Projetos bolsa",
      domain: "prointer.ufc.br",
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("value");
    expect(res.body.value.length).toBeGreaterThan(0);

    res.body.value.forEach((value: any) => {
      expect(value).toHaveProperty("title");
      expect(value).toHaveProperty("url");
      expect(value).toHaveProperty("date");
      expect(value).toHaveProperty("publishLink");
      expect(value).toHaveProperty("publishedFrom");
      expect(value).toHaveProperty("content");
    });
  }, 40000);

  test("shouldn't to be able to get news from domain when filter title not exists", async () => {
    const res = await request(app).get("/api/v1/news/all").query({
      pageNumber: 1,
      title: "Futebol",
      domain: "prointer.ufc.br",
    });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty("value");
    expect(res.body.value.length).toEqual(0);
  }, 40000);

  test("shouldn't to be able to get news when domain page not exists", async () => {
    const domainPage = "test.ufc.br";
    const res = await request(app).get("/api/v1/news/all").query({
      pageNumber: 1,
      title: "Projetos bolsa",
      domain: domainPage,
    });
    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.status).toBe(400);

    expect(res.body).toStrictEqual({
      message: `net::ERR_NAME_NOT_RESOLVED at ${domainPage}/pt/category/noticias/page/1/?s=Projetos bolsa`,
    });
  }, 40000);
});
