import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { RestaurantServices } from "../../infra/services/reastaurant-data-miner";
import { PutCreditsInCardUseCase } from "../../use-cases/put-credits-in-card";

export const putCreditsInCardUseCaseFactory = () => {
  return new PutCreditsInCardUseCase(
    new RestaurantServices(PuppeteerAdapter.create())
  );
};
