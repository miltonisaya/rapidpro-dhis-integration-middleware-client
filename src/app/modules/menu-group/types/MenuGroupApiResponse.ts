import {MenuGroup} from "./MenuGroup";

export interface MenuGroupApiResponse {
  data: MenuGroup[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
