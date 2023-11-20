import { GetEventsController } from "../../controllers/get-events.controller";
import { ValidateGetEventsRequest } from "../../infra/validator/validate-request";
import { GetEventsUseCaseFactory } from "../use-cases/get-events-usecase.factory";

export const getEventsControllerFactory = () => {
  return new GetEventsController(
    GetEventsUseCaseFactory(),
    new ValidateGetEventsRequest()
  );
};
