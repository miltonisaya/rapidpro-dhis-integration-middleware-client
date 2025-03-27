import {Authority} from "./Authority";

export interface AuthorityApiResponse {
  data: Authority[];
  page: number;
  size: number;
  status: number;
  total: number;
}
