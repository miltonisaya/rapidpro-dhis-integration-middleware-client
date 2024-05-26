import {Authority} from "../../authority/types/Authority";

export interface Menu {
  name: string;
  code: string;
  description: string;
  uuid: string;
  authorities: Authority[];
}
