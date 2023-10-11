import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowNewsUseCase } from "../../use-cases/get-all-news";

export const getNewsUseCaseFactory = () => {
  return new ShowNewsUseCase(new NewsServices(PuppeteerAdapter.create()));
};
