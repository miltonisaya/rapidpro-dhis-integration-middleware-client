import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {ContactComponent} from "./modules/contact/contact.component";
import {FlowComponent} from "./modules/flow/flow.component";
import {DataElementComponent} from "./modules/data-element/data-element.component";
import {ProgramComponent} from "./modules/program/program.component";
import {UserComponent} from "./modules/user/user.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {LoginComponent} from "./layouts/login/login.component";
import {Route} from "@angular/router";
import {RoleComponent} from "./modules/role/role.component";
import {OrganisationUnitComponent} from "./modules/organisation-unit/organisation-unit.component";
import {AuthGuard} from "./auth/auth.guard";
import {MenuGroupComponent} from "./modules/menu-group/menu-group.component";
import {MenuItemComponent} from "./modules/menu-item/menu-item.component";

export const APP_ROUTES: Route[] = [{
  path: "",
  component: DefaultComponent,
  children: [
    {
      path: "contacts",
      component: ContactComponent,
      canActivate: [AuthGuard]
    }, {
      path: "dashboard",
      component: DashboardComponent,
      canActivate: [AuthGuard]
    }, {
      path: "organisation-units",
      component: OrganisationUnitComponent,
      canActivate: [AuthGuard]
    }, {
      path: "flows",
      component: FlowComponent,
      canActivate: [AuthGuard]
    }, {
      path: "data-elements",
      component: DataElementComponent,
      canActivate: [AuthGuard]
    }, {
      path: "programs",
      component: ProgramComponent,
      canActivate: [AuthGuard]
    }, {
      path: "users",
      component: UserComponent,
      canActivate: [AuthGuard]
    }, {
      path: "roles",
      component: RoleComponent,
      canActivate: [AuthGuard]
    }, {
      path: "menu-groups",
      component: MenuGroupComponent,
      canActivate: [AuthGuard]
    }, {
      path: "menu-items",
      component: MenuItemComponent,
      canActivate: [AuthGuard]
    }
  ]
}, {
  path: "login",
  component: LoginComponent
},
  {
    path: '**',
    redirectTo: 'dashboard'
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
