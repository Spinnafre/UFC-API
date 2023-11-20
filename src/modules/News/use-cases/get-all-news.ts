import { Either } from "../../../shared/Either";
import { GetAllNews } from "./ports/get-all-news";
import { NewsDataMiner } from "./ports/news-data-miner-services";

export class ShowNewsUseCase {
  private EventsDataMiner: NewsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: NewsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }
  async execute(
    request: GetAllNews.Request
  ): Promise<Either<Error, GetAllNews.Response>> {
    return await this.EventsDataMiner.getNews(request);
  }
}
