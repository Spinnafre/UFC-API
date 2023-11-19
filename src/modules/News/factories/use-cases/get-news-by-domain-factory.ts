import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowAllNewsByDomainUseCase } from "../../use-cases/get-news-by-domain";
import { puppeteerAdapter } from "../infra/puppeteerAdapter";

export const getNewsByDomainUseCaseFactory = () => {
  return new ShowAllNewsByDomainUseCase(new NewsServices(puppeteerAdapter));
};
