import { GetHighlightsEventsController } from "../../controllers/get-highlights-events.controller";
import { GetHighlightsEventsUseCaseFactory } from "../use-cases/get-highlights-events-usecase.factory";

export const getHighlightsEventsControllerFactory = () => {
  return new GetHighlightsEventsController(GetHighlightsEventsUseCaseFactory());
};
