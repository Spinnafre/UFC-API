import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Show balance by user", () => {
  // beforeEach(() => {
  //   jest.resetAllMocks();
  // });

  // test("should to be able to get user balance when card number and registry number exists", async () => {
  //   const res = await request(app)
  //     .get("/api/v1/restaurant/getUserBalance")
  //     .query({
  //       card_number: ,
  //       registry_number: ,
  //     });

  //   expect(res.body).toHaveProperty("value");
  //   expect(res.body.value).toHaveProperty("transactions");
  //   expect(res.body.value).toHaveProperty("user_info");
  // }, 40000);

  test("shouldn't to be able to get user balance when card number and registry number not exists", async () => {
    const res = await request(app)
      .get("/api/v1/restaurant/getUserBalance")
      .query({
        card_number: 0,
        registry_number: 0,
      });

    expect(res.statusCode).toBe(400);

    expect(res.body).toStrictEqual({
      message: "Não foi possível buscar usuário",
    });
  }, 40000);
});
