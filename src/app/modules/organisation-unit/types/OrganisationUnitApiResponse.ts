import {OrganisationUnit} from "./OrganisationUnit";

export interface OrganisationUnitApiResponse {
  data: OrganisationUnit[];
  page: number;
  size: number;
  status: number;
  total: number;
}
