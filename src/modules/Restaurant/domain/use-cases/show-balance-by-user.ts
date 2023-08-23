export namespace ShowBalanceByUser {
  export type Request = {
    input_card_number: number;
    input_registry_number: number;
  };

  export type Response = {
    user_info: {
      user_name: string;
      user_credits: string;
    } | null;
    transactions: Array<{
      date: string | null;
      type: string | null;
      details: string | null;
    }> | null;
  };
}
