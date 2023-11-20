import { Either } from "../../../shared/Either";
import { ShowMenuByDay } from "./ports/show-menu-by-day";
import { RestaurantDataMiner } from "./ports/restaurant-data-miner-services";
export class ShowMenuByDayUseCase {
  private RestaurantDataMiner: RestaurantDataMiner.Services;
  // TO-DO : Cache System

  constructor(RestaurantDataMiner: RestaurantDataMiner.Services) {
    this.RestaurantDataMiner = RestaurantDataMiner;
  }
  async execute(
    request: ShowMenuByDay.Request
  ): Promise<Either<Error, ShowMenuByDay.Response>> {
    return await this.RestaurantDataMiner.getMenuByDate(request.date);
  }
}
