import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { NewsServices } from "../../infra/services/news-data-miner-services";
import { ShowContestsAndSelectionsUseCase } from "../../use-cases/get-contests-and-selections";

export const getContestAndSelectionsFactory = () => {
  return new ShowContestsAndSelectionsUseCase(
    new NewsServices(PuppeteerAdapter.create())
  );
};
