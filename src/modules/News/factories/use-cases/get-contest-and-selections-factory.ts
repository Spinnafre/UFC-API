import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowContestsAndSelectionsUseCase } from "../../use-cases/get-contests-and-selections";

export const getContestAndSelectionsFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowContestsAndSelectionsUseCase(puppeteerAdapter);
};
