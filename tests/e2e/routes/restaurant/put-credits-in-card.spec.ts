import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Put credits in card", () => {
  // beforeEach(() => {
  //   jest.resetAllMocks();
  // });
  // test("should to be able to get user payment info", async () => {
  //   const res = await request(app)
  //     .get("/api/v1/restaurant/getPaymentInfo")
  //     .query({
  //       card_number: ,
  //       registry_number: ,
  //       qtd_credits: 2,
  //       paymentMethod: 'pix',
  //     });
  //   expect(res.body).toHaveProperty("value");
  //   expect(res.body.value).toHaveProperty("transactions");
  //   expect(res.body.value).toHaveProperty("user_info");
  // }, 40000);
});
