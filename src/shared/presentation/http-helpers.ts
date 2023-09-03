import { Logger } from "../infra/logger/logger";
import { HttpResponse } from "./http-response";

export const ok = (data: any): HttpResponse => ({
  status: 200,
  body: data,
});

export const created = (data: any): HttpResponse => ({
  status: 201,
  body: data,
});

export const forbidden = (error: Error): HttpResponse => {
  Logger.error(error);
  return {
    status: 403,
    body: {
      message: error.message,
    },
  };
};

export const badRequest = (error: Error): HttpResponse => {
  Logger.error(error);
  return {
    status: 400,
    body: {
      message: error.message,
    },
  };
};

export const serverError = (error: Error): HttpResponse => {
  Logger.error(error);
  return {
    status: 500,
    body: {
      message: error.message,
    },
  };
};
