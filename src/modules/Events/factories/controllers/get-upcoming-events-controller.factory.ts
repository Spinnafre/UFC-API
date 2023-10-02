import { GetUpcomingEventsController } from "../../controllers/get-upcoming-events.controller";
import { GetUpcomingEventsUseCaseFactory } from "../use-cases/get-upcoming-events-usecase.factory";

export const getUpcomingEventsControllerFactory = () => {
  return new GetUpcomingEventsController(GetUpcomingEventsUseCaseFactory());
};
