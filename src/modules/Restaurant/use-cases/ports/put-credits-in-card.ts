export namespace PutCreditsInCard {
  export type Request = {
    card_number: number;
    registry_number: number;
    qtd_credits: number;
    paymentMethod: string;
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
