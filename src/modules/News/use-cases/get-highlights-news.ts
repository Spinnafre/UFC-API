import { Either } from "../../../shared/Either";
import { GetHighlightsNews } from "./ports/get-highlights-news";
import { NewsDataMiner } from "./ports/news-data-miner-services";

export class ShowHighlightsNewsUseCase {
  private EventsDataMiner: NewsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: NewsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }
  async execute(): Promise<Either<Error, GetHighlightsNews.Response>> {
    return await this.EventsDataMiner.getHighlightsNews();
  }
}
