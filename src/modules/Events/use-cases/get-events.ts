import { EventsDataMiner } from "./ports/events-page-data-miner-protocol";
import { GetEventsUseCaseProtocols } from "./ports/get-events-protocol";

export class GetEventsUseCase implements GetEventsUseCaseProtocols.UseCase {
  private EventsDataMiner: EventsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: EventsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }

  async execute(
    request: GetEventsUseCaseProtocols.Request
  ): GetEventsUseCaseProtocols.Response {
    return await this.EventsDataMiner.getEventsBySearchParams(request);
  }
}
