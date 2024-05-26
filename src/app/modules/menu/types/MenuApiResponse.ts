import {Menu} from "./Menu";

export interface MenuApiResponse {
  data: Menu[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
