import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { RestaurantServices } from "../../infra/services/reastaurant-data-miner";
import { ShowMenuByDayUseCase } from "../../use-cases/show-menu-by-day";

export const showMenuByDayUseCaseFactory = () => {
  return new ShowMenuByDayUseCase(
    new RestaurantServices(PuppeteerAdapter.create())
  );
};
