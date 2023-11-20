import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowHighlightsNewsUseCase } from "../../use-cases/get-highlights-news";
import { puppeteerAdapter } from "../infra/puppeteerAdapter";

export const getHighlightsNewsFactory = () => {
  return new ShowHighlightsNewsUseCase(new NewsServices(puppeteerAdapter));
};
