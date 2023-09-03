export interface GetAllNewsRequestDTO {
  pageNumber: number;
  title: string;
}
export interface GetAllNewsResponseDTO {
  payment: {
    expiration: string;
    qrCodeImg: string;
    qrCodeText: string;
  };
  payerDetails: any;
}
