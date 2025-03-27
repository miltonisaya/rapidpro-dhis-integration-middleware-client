import {Role} from "../../role/types/Role";
import {OrganisationUnit} from "../../organisation-unit/types/OrganisationUnit";

export interface User {
  name: string;
  email: string;
  password: string;
  phone: string;
  uuid: string;
  roles: Role[];
  organisationUnit: OrganisationUnit;
}
