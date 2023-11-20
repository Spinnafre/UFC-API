import { Either } from "../../../../shared/Either";
import { EventEntity } from "../../domain/Event";
import { EventsDataMiner } from "./events-page-data-miner-protocol";

export namespace GetEventsUseCaseProtocols {
  export type Request =
    | EventsDataMiner.PageNumber
    | EventsDataMiner.EventQueryParams;
  export type Response = Promise<Either<Error, Array<Required<EventEntity>>>>;

  export interface UseCase {
    execute(request: Request): Response;
  }
}
