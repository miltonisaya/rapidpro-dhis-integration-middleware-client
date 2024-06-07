import {Authority} from "../../authority/types/Authority";

export interface Role {
  name: string;
  code: string;
  description: string;
  uuid: string;
  authorities: Authority[];
}
