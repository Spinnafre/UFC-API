import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { PutCreditsInCardUseCase } from "../../use-cases/put-credits-in-card";

export const putCreditsInCardUseCaseFactory = () => {
  const puppeteerAdapter = PuppeteerAdapter.create();
  return new PutCreditsInCardUseCase(puppeteerAdapter);
};
