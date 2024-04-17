import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DefaultComponent} from "./layouts/default/default.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {ContactsComponent} from "./pages/contacts/contacts.component";
import {UsersComponent} from "./pages/users/users.component";
import {DataElementsComponent} from "./pages/data-elements/data-elements.component";
import {OrganisationUnitsComponent} from "./pages/organisation-units/organisation-units.component";
import {ProgramsComponent} from "./pages/programs/programs.component";

const routes: Routes = [{
  path:"",
  component:DefaultComponent,
  children:[{
    path:"dashboard",
    component: DashboardComponent
  }, {
    path: "contacts",
    component: ContactsComponent
  }, {
    path:"users",
    component:UsersComponent
  }, {
    path: "data-elements",
    component: DataElementsComponent
  }, {
    path: "organisation-units",
    component:OrganisationUnitsComponent
  }, {
    path:"programs",
    component: ProgramsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
