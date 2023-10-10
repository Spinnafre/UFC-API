import { Either } from "../../../shared/Either";
import { GetContestAndSelections } from "../domain/use-cases/get-contests-and-selections";
import { NewsDataMiner } from "../domain/use-cases/news-data-miner-services";

export class ShowContestsAndSelectionsUseCase {
  private EventsDataMiner: NewsDataMiner.Services;
  // TO-DO : Cache System

  constructor(EventsDataMiner: NewsDataMiner.Services) {
    this.EventsDataMiner = EventsDataMiner;
  }
  async execute(
    request: GetContestAndSelections.Request
  ): Promise<Either<Error, GetContestAndSelections.Response>> {
    return await this.EventsDataMiner.getContestsAndSelections(request);
  }
}
