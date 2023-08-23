import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowMenuByDayUseCase } from "../../use-cases/show-menu-by-day";

export const showMenuByDayUseCaseFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowMenuByDayUseCase(puppeteerAdapter);
};
