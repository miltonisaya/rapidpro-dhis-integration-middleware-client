import {Role} from "../../role/types/Role";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  uuid: string;
  roles: Role[];
}
