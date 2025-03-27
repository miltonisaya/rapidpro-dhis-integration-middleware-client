import {AfterContentChecked, ChangeDetectorRef, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {AuthService} from "./auth/auth.service";
import {FormsModule} from "@angular/forms";
import {LoaderService} from "./modules/loader/loader.service";
import {MatProgressBar} from "@angular/material/progress-bar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressBar
  ],
  providers: [AuthService]
})
export class AppComponent implements AfterContentChecked {
  constructor(
    protected loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
}
