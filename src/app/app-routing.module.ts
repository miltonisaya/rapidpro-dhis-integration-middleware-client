import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "./layouts/default/default.component";
import {DashboardComponent} from "./modules/dashboard/dashboard.component";
import {ContactComponent} from "./modules/contact/contact.component";
import {UserComponent} from "./modules/user/user.component";
import {DataElementComponent} from "./modules/data-element/data-element.component";
import {OrganisationUnitComponent} from "./modules/organisation-unit/organisation-unit.component";
import {ProgramComponent} from "./modules/program/program.component";

const routes: Routes = [{
  path:"",
  component:DefaultComponent,
  children:[{
    path:"dashboard",
    component: DashboardComponent
  }, {
    path: "contacts",
    component: ContactComponent
  }, {
    path:"users",
    component:UserComponent
  }, {
    path: "data-elements",
    component: DataElementComponent
  }, {
    path: "organisation-units",
    component:OrganisationUnitComponent
  }, {
    path:"programs",
    component: ProgramComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
