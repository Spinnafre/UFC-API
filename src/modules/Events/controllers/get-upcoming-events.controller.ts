import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { GetUpcomingEventsUseCaseProtocols } from "../use-cases/ports/get-upcoming-events-protocol";

export class GetUpcomingEventsController {
  private getEvents: GetUpcomingEventsUseCaseProtocols.UseCase;

  constructor(getEvents: GetUpcomingEventsUseCaseProtocols.UseCase) {
    this.getEvents = getEvents;
  }
  async handle(): Promise<HttpResponse<any>> {
    try {
      const result = await this.getEvents.execute();

      return ok(result);
    } catch (error) {
      return badRequest(error as Error);
    }
  }
}

export namespace GetUpcomingEventsControllerDTO {
  export type Request = void;
}
