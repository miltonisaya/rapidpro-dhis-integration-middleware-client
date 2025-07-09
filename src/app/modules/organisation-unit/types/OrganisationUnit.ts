export interface OrganisationUnit {
  id: string | number;
  code: string;
  name: string;
  otherNames?: string | null;
  parent?: OrganisationUnit | null;
  hasChildren?: boolean;
  children?: OrganisationUnit[];
}
