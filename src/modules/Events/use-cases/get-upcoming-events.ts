import { EventsDataMiner } from "./ports/events-page-data-miner-protocol";
import { GetUpcomingEventsUseCaseProtocols } from "./ports/get-upcoming-events-protocol";

export class GetUpcomingEventsUseCase
  implements GetUpcomingEventsUseCaseProtocols.UseCase
{
  private EventsDataMiner: EventsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: EventsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }

  async execute(): GetUpcomingEventsUseCaseProtocols.Response {
    return await this.EventsDataMiner.getUpcomingEvents();
  }
}
