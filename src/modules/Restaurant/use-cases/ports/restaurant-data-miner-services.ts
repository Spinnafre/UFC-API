import { Either } from "../../../../shared/Either";
import { ElementNotFoundError } from "../../domain/errors/element-not-found";
import { PutCreditsInCard } from "./put-credits-in-card";
import { ShowBalanceByUser } from "./show-balance-by-user";
import { ShowMenuByDay } from "./show-menu-by-day";

export namespace RestaurantDataMiner {
  export interface Services {
    getMenuByDate(date: string): Promise<Either<Error, ShowMenuByDay.Response>>;
    getUserBalance({
      card_number,
      registry_number,
    }: ShowBalanceByUser.Request): Promise<
      Either<Error, ShowBalanceByUser.Response>
    >;
    getPaymentQrCode({
      card_number,
      paymentMethod,
      qtd_credits,
      registry_number,
    }: PutCreditsInCard.Request): Promise<
      Either<Error | ElementNotFoundError, PutCreditsInCard.Response>
    >;
  }
}
