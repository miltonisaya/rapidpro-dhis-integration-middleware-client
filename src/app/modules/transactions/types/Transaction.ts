export interface Transaction {
  id: string;
  uuid: string;
  dateProcessed: string;
  payload: string;
  dhisResponse: string;
  isSent: boolean;
  status?: string;
  type?: string;
}

export interface TransactionApiResponse {
  data: Transaction[];
  status: string;
  message: string;
}
