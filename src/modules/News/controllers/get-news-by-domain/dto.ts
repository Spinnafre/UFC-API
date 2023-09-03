export interface GetNewsByDomainRequestDTO {
  pageNumber: number;
  title: string;
  domain: string;
}

export type GetNewsByDomainResponseDTO = Array<{
  title: string | null;
  url: string | null;
  date: string | null;
  publishLink: string | null;
  publishedFrom: string | null;
  content: string | null;
}>;
