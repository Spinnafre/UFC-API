import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowHighlightsNewsUseCase } from "../../use-cases/get-highlights-news";

export const getHighlightsNewsFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowHighlightsNewsUseCase(puppeteerAdapter);
};
