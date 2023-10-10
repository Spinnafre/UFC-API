export interface ShowMenuRequestDTO {
  date: string;
}
export interface ShowMenuResponseItems {
  type: string;
  meat: Array<{
    title: string;
    options: string;
  }>;
}
export type ShowMenuResponseDTO = Array<ShowMenuResponseItems>;
