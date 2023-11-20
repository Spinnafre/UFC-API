export interface PutCreditsInCardRequestDTO {
  card_number: number | null;
  registry_number: number | null;
  qtd_credits: number | null;
  paymentMethod: string | null;
}
export interface PutCreditsInCardResponseDTO {
  payment: {
    expiration: string;
    qrCodeImg: string;
    qrCodeText: string;
  };
  payerDetails: any;
}
