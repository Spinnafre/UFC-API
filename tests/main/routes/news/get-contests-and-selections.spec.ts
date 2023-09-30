import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Get contest and selections", () => {
  test("should to be able to get contests and selections by title and page number", async () => {
    const res = await request(app)
      .get("/api/v1/news/contestsAndSelections")
      .query({
        pageNumber: 40,
        title: "bolsa",
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

  test("shouldn't to be able to get contests and selections when filter title not exists", async () => {
    const res = await request(app)
      .get("/api/v1/news/contestsAndSelections")
      .query({
        pageNumber: 1,
        title: "Futebol",
      });

    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");

    expect(res.status).toBe(400);

    expect(res.body).toStrictEqual({
      message:
        "Não foi possível carregar notícias de Editar de Concursos e Seleções",
    });
  }, 40000);

  test("shouldn't to be able to get contests and selections when page number not exists", async () => {
    const res = await request(app)
      .get("/api/v1/news/contestsAndSelections")
      .query({
        pageNumber: 1000000,
        title: "Projetos bolsa",
      });
    expect(res.headers["content-type"]).toBe("application/json; charset=utf-8");
    expect(res.status).toBe(400);

    expect(res.body).toStrictEqual({
      message:
        "Não foi possível carregar notícias de Editar de Concursos e Seleções",
    });
  }, 40000);
});
