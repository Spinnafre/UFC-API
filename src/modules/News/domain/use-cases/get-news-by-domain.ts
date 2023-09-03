export namespace GetNews {
  export type Request = { pageNumber: number; title: string; domain: string };

  export type Response = Array<{
    title: string | null;
    url: string | null;
    date: string | null;
    publishLink: string | null;
    publishedFrom: string | null;
    content: string | null;
  }>;
}
