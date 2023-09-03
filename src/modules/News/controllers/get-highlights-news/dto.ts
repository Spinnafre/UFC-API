export interface GetHighlightsNewsResponseDTO {
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
  extra:
    | Array<{
        url: string;
        description: string;
      }>
    | [];
}
