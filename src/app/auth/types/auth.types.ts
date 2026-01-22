import { Role } from '../../modules/role/types/Role';
import { OrganisationUnit } from '../../modules/organisation-unit/types/OrganisationUnit';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  sortOrder: number;
  children: MenuItem[];
}

export interface CurrentUser {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  menus: MenuItem[];
  roles: Role[];
  organisationUnit: OrganisationUnit;
  isSuperAdministrator: boolean;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    token: string;
    user: Omit<CurrentUser, 'token' | 'menus' | 'isSuperAdministrator'>;
    menus: MenuItem[];
    isSuperAdmin: boolean;
  };
}
