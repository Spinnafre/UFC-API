import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowAllNewsByDomainUseCase } from "../../use-cases/get-news-by-domain";

export const getNewsByDomainUseCaseFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowAllNewsByDomainUseCase(puppeteerAdapter);
};
