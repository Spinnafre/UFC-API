import { badRequest, ok } from "../../../shared/presentation/http-helpers";
import { HttpResponse } from "../../../shared/presentation/http-response";
import { GetHighlightsEventsUseCaseProtocols } from "../use-cases/ports/get-highlights-events-prococol";

export class GetHighlightsEventsController {
  private getEvents: GetHighlightsEventsUseCaseProtocols.UseCase;

  constructor(getEvents: GetHighlightsEventsUseCaseProtocols.UseCase) {
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

export namespace GetHighlightsEventsControllerDTO {
  export type Request = void;
}
