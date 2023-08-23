export interface PutCreditsInCardRequestDTO {
  input_card_number: number;
  input_registry_number: number;
  input_qtd_credits: number;
  input_paymentMethod: "pix" | "gru";
}
export interface PutCreditsInCardResponseDTO {
  payment: {
    expiration: string;
    qrCodeImg: string;
    qrCodeText: string;
  };
  payerDetails: any;
}
