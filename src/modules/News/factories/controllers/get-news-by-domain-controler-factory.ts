import { GetNewsByDomainController } from "../../controllers/get-news-by-domain/get-news-by-domain";
import { ValidateGetNewsByDomainRequest } from "../../infra/validator/validate-request";
import { getNewsByDomainUseCaseFactory } from "../use-cases/get-news-by-domain-factory";

export const getNewsByDomainControllerFactory = () => {
  return new GetNewsByDomainController(
    getNewsByDomainUseCaseFactory(),
    new ValidateGetNewsByDomainRequest()
  );
};
