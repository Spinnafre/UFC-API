import { NewsEntity } from "../../domain/entities/news";

export namespace GetNews {
  export type Request = { pageNumber: number; title: string; domain: string };

  export type Response = Array<NewsEntity>;
}
