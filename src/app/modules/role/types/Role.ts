import {Authority} from "./Authority";

export interface Role {
  name: string;
  code: string;
  description: string;
  uuid: string;
  authorities: Authority[];
}
