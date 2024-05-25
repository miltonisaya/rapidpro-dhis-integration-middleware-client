import {Role} from "./Role";

export interface RoleApiResponse {
  data: Role[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
