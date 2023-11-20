import { Either } from "../../../../shared/Either";
import { NewsEntity } from "../../domain/entities/news";
import { GetHighlightsNews } from "./get-highlights-news";

export namespace NewsDataMiner {
  export type PageNumber = number;

  export type EventQueryParams = {
    pageNumber: string;
    title: string;
    domain?: string;
  };

  export type Response = Array<NewsEntity>;

  export type GetNewsRequest = { pageNumber: number; title?: string };

  export interface Services {
    getContestsAndSelections(
      request: GetNewsRequest
    ): Promise<Either<Error, Array<any>>>;
    getNews(request: GetNewsRequest): Promise<Either<Error, Array<NewsEntity>>>;
    getHighlightsNews(): Promise<Either<Error, GetHighlightsNews.Response>>;
    getNewsFromDomainPage(request: {
      pageNumber: number;
      title: string;
      domain: string;
    }): Promise<Either<Error, Array<NewsEntity>>>;
  }
}
