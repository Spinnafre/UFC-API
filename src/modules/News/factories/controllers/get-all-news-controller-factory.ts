import { ShowNewsController } from "../../controllers/get-all-news";
import { ValidateGetAllNewsRequest } from "../../infra/validator/validate-request";
import { getNewsUseCaseFactory } from "../use-cases/get-news-factory";

export const getNewsControllerFactory = () => {
  return new ShowNewsController(
    getNewsUseCaseFactory(),
    new ValidateGetAllNewsRequest()
  );
};
