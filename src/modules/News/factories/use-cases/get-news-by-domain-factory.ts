import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowAllNewsByDomainUseCase } from "../../use-cases/get-news-by-domain";

export const getNewsByDomainUseCaseFactory = () => {
  return new ShowAllNewsByDomainUseCase(
    new NewsServices(PuppeteerAdapter.create())
  );
};
