export interface GetUserBalanceRequestDTO {
  card_number: number;
  registry_number: number;
}
export interface GetUserBalanceResponseDTO {
  user_info: {
    user_name: string;
    user_credits: string;
  } | null;
  transactions: Array<{
    date: string | null;
    type: string | null;
    details: string | null;
  }> | null;
}
