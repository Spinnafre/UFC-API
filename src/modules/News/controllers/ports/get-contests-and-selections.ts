export interface ShowContestsAndSelectionsRequestDTO {
  pageNumber: number;
  title?: string;
}
export type ShowContestsAndSelectionsResponseDTO = Array<{
  text: string;
  link: string;
  date: string;
}>;
