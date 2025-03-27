import {Contact} from "./Contact";

export interface ContactApiResponse {
  data: Contact[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
