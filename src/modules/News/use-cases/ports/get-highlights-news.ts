export namespace GetHighlightsNews {
  export type Request = {};

  export type Response = {
    highlight:
      | Array<{
          link: string;
          thumbnailUrl: string;
        }>
      | [];
    latestNews:
      | Array<{
          img: string;
          title: {
            url: string;
            description: string;
          };
          description: string;
        }>
      | [];
    contestsAndSelections:
      | Array<{
          url: string;
          description: string;
        }>
      | [];
  };
}
