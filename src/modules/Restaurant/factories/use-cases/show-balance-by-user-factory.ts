import { PuppeteerAdapter } from "../../../../shared/adapters/scrapper/puppeteer-adapter";
import { RestaurantServices } from "../../infra/services/reastaurant-data-miner";
import { ShowBalanceByUserUseCase } from "../../use-cases/show-balance-by-user";

export const showUserBalanceUseCaseFactory = () => {
  return new ShowBalanceByUserUseCase(
    new RestaurantServices(PuppeteerAdapter.create())
  );
};
