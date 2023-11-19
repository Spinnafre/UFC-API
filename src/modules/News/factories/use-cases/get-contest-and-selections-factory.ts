import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowContestsAndSelectionsUseCase } from "../../use-cases/get-contests-and-selections";
import { puppeteerAdapter } from "../infra/puppeteerAdapter";

export const getContestAndSelectionsFactory = () => {
  return new ShowContestsAndSelectionsUseCase(
    new NewsServices(puppeteerAdapter)
  );
};
