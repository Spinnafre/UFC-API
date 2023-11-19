import request from "supertest";

import app from "../../../../src/main/http/app";

jest.useRealTimers();

describe("Get events", () => {
  test.todo(
    "should to be able to get news from domain by title and page number"
  );

  test.todo(
    "shouldn't to be able to get news from domain when filter title not exists"
  );

  test.todo("shouldn't to be able to get news when domain page not exists");
});
