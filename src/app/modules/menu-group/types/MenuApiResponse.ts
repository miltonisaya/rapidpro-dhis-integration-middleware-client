import {MenuGroup} from "./MenuGroup";

export interface MenuApiResponse {
  data: MenuGroup[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
