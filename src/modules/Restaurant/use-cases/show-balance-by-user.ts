import { Either } from "../../../shared/Either";
import { ShowBalanceByUser } from "./ports/show-balance-by-user";
import { RestaurantDataMiner } from "./ports/restaurant-data-miner-services";
export class ShowBalanceByUserUseCase {
  private RestaurantDataMiner: RestaurantDataMiner.Services;
  // TO-DO : Cache System

  constructor(RestaurantDataMiner: RestaurantDataMiner.Services) {
    this.RestaurantDataMiner = RestaurantDataMiner;
  }

  async execute(
    request: ShowBalanceByUser.Request
  ): Promise<Either<Error, ShowBalanceByUser.Response>> {
    return await this.RestaurantDataMiner.getUserBalance(request);
  }
}
