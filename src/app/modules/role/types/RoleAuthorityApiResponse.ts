import {Authority} from "../../authority/types/Authority";

export interface AuthorityApiResponse {
  authorities: Authority[];
  resource: string;
}
