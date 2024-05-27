import {User} from "./User";

export interface UserApiResponse {
  data: User[];
  page: number;
  size: number;
  status: number;
  total: number;
  message: string;
}
