export namespace GetContestAndSelections {
  export type Request = {
    pageNumber: number;
    title: string;
  };

  export type Response = Array<{
    text: string;
    link: string;
    date: string;
  }>;
}
