import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { ShowBalanceByUserUseCase } from "../../use-cases/show-balance-by-user";

export const showUserBalanceUseCaseFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new ShowBalanceByUserUseCase(puppeteerAdapter);
};
