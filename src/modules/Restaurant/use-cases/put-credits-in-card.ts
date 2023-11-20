import { Either } from "../../../shared/Either";
import { ElementNotFoundError } from "../domain/errors/element-not-found";
import { PutCreditsInCard } from "./ports/put-credits-in-card";
import { RestaurantDataMiner } from "./ports/restaurant-data-miner-services";

export class PutCreditsInCardUseCase {
  private RestaurantDataMiner: RestaurantDataMiner.Services;
  // TO-DO : Cache System

  constructor(RestaurantDataMiner: RestaurantDataMiner.Services) {
    this.RestaurantDataMiner = RestaurantDataMiner;
  }
  async execute(
    request: PutCreditsInCard.Request
  ): Promise<Either<Error | ElementNotFoundError, PutCreditsInCard.Response>> {
    return await this.RestaurantDataMiner.getPaymentQrCode(request);
  }
}
