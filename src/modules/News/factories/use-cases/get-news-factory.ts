import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowNewsUseCase } from "../../use-cases/get-all-news";
import { puppeteerAdapter } from "../infra/puppeteerAdapter";

export const getNewsUseCaseFactory = () => {
  return new ShowNewsUseCase(new NewsServices(puppeteerAdapter));
};
