import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowHighlightsNewsUseCase } from "../../use-cases/get-highlights-news";

export const getHighlightsNewsFactory = () => {
  return new ShowHighlightsNewsUseCase(
    new NewsServices(PuppeteerAdapter.create())
  );
};
