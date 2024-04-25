import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {ContactComponent} from "./modules/contact/contact.component";
import {OrganisationUnitComponent} from "./modules/organisation-unit/organisation-unit.component";
import {FlowComponent} from "./modules/flow/flow.component";
import {DataElementComponent} from "./modules/data-element/data-element.component";
import {ProgramComponent} from "./modules/program/program.component";
import {UserComponent} from "./modules/user/user.component";
import {DefaultComponent} from "./layouts/default/default.component";
import {LoginComponent} from "./layouts/login/login.component";
import {Route} from "@angular/router";

export const APP_ROUTES: Route[] = [{
  path: "",
  component: DefaultComponent,
  children: [
    {
      path: "contacts",
      component: ContactComponent
    }
  ]
}, {
  path: "login",
  component: LoginComponent
}
];
