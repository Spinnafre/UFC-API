import { ShowHighlightsNewsController } from "../../controllers/get-highlights-news";
import { getHighlightsNewsFactory } from "../use-cases/get-highlights-news-factory";

export const getHighlightsNewsControllerFactory = () => {
  return new ShowHighlightsNewsController(getHighlightsNewsFactory());
};
