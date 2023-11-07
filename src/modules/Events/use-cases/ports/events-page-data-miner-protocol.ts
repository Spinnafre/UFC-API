import { Either } from "../../../../shared/Either";
import { EventEntity } from "../../domain/Event";

export namespace EventsDataMiner {
  export type PageNumber = number;

  export type EventQueryParams = {
    date: string;
    keyWord: string;
    campus: string;
    category: string;
    area: string;
  };

  export type Response = Array<EventEntity>;

  export interface Services {
    getEventsBySearchParams(
      request: PageNumber | EventQueryParams,
      timeout?: number
    ): Promise<Either<Error, Array<Required<EventEntity>>>>;
    getHightLightsEvents(): Promise<Either<Error, Array<EventEntity>>>;
    getUpcomingEvents(): Promise<Either<Error, Array<EventEntity>>>;
  }
}
