import {MenuItem} from "./MenuItem";

export interface MenuItemApiResponse {
  data: MenuItem[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
