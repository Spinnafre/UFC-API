import { PutCreditsInCardController } from "../../controllers/put-credits-in-card/put-credits-in-card";
import { ValidatePutUserCreditsRequest } from "../../infra/validator/validate-request";
import { putCreditsInCardUseCaseFactory } from "../use-cases/put-credits-in-card-factory";

export const putCreditsInCardControllerFactory = () => {
  return new PutCreditsInCardController(
    putCreditsInCardUseCaseFactory(),
    new ValidatePutUserCreditsRequest()
  );
};
