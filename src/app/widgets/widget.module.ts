import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarchartComponent} from "./barchart/barchart.component";


@NgModule({
  declarations: [
    BarchartComponent
  ],
  exports: [
    BarchartComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WidgetModule {
}
