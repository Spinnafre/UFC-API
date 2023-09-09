export interface PutCreditsInCardRequestDTO {
  card_number: number;
  registry_number: number;
  qtd_credits: number;
  paymentMethod: string;
}
export interface PutCreditsInCardResponseDTO {
  payment: {
    expiration: string;
    qrCodeImg: string;
    qrCodeText: string;
  };
  payerDetails: any;
}
