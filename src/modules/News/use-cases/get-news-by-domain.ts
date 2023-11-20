import { Either } from "../../../shared/Either";
import { GetNews } from "./ports/get-news-by-domain";
import { NewsDataMiner } from "./ports/news-data-miner-services";

export class ShowAllNewsByDomainUseCase {
  private EventsDataMiner: NewsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: NewsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }

  async execute(
    request: GetNews.Request
  ): Promise<Either<Error, GetNews.Response>> {
    return await this.EventsDataMiner.getNewsFromDomainPage(request);
  }
}
