import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowNewsUseCase } from "../../use-cases/get-all-news";

export const getNewsUseCaseFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowNewsUseCase(puppeteerAdapter);
};
