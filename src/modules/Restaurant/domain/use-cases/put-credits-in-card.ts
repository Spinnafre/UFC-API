export namespace PutCreditsInCard {
  export type Request = {
    input_card_number: number;
    input_registry_number: number;
    input_qtd_credits: number;
    input_paymentMethod: "pix" | "gru";
  };

  export type Response = {
    payment: {
      expiration: string;
      qrCodeImg: string;
      qrCodeText: string;
    };
    payerDetails: any;
  };
}
