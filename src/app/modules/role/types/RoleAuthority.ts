import {Authority} from "../../authority/types/Authority";

export interface RoleAuthority {
  resource: string;
  authorities: Authority[];
}
