import { Either } from "../../../../shared/Either";
import { EventEntity } from "../../domain/Event";

export namespace GetHighlightsEventsUseCaseProtocols {
  export type Request = void;
  export type Response = Promise<Either<Error, Array<Required<EventEntity>>>>;

  export interface UseCase {
    execute(): Response;
  }
}
