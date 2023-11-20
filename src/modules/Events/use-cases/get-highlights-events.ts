import { EventsDataMiner } from "./ports/events-page-data-miner-protocol";
import { GetHighlightsEventsUseCaseProtocols } from "./ports/get-highlights-events-prococol";

export class GetHighlightsEventsUseCase
  implements GetHighlightsEventsUseCaseProtocols.UseCase
{
  private EventsDataMiner: EventsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: EventsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }

  async execute(): GetHighlightsEventsUseCaseProtocols.Response {
    return await this.EventsDataMiner.getHightLightsEvents();
  }
}
