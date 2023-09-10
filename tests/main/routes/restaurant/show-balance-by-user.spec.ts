import request from "supertest";

import app from "../../../../src/main/http/app";

describe("Show balance by user", () => {
  test("should to be able to get user balance when card number and registry number exists", async () => {
    await request(app)
      .get("/api/v1/restaurant/getUserBalance")
      .query({
        card_number: 2887746615,
        registry_number: 470605,
      })
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveProperty("value");
        expect(res.body.value).toHaveProperty("transactions");
        expect(res.body.value).toHaveProperty("user_info");
      });
  });
});
