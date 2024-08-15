import {Authority} from "../../authority/types/Authority";
import {OrganisationUnit} from "../../organisation-unit/types/OrganisationUnit";

export interface Contact {
  name: string;
  facilityCode: string;
  organisationUnit: OrganisationUnit;
  registrationDate: string;
  sex: string;
  urn: string;
  fields: string;
  createdOn: string;
  uuid: string;
}
