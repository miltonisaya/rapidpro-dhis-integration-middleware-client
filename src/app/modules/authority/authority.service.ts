import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RoleAuthorityApiResponse} from "../role/types/RoleAuthorityApiResponse";
import {F} from "@angular/cdk/keycodes";

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8081/api/v1';
  form: FormGroup = new FormGroup({
    roleUuid: new FormControl('',Validators.required),
    authorities: new FormArray([])
  });

  constructor(private http: HttpClient) {
  }

  initializeFormGroup() {
    return this.form.patchValue({
      roleUuid: '',
      authorityUuid: ''
    });
  }

  findByRole(uuid: string): Observable<any> {
    let requestUrl = `${this.baseUrl}/authorities/role/` + uuid;
    return this.http.get(requestUrl);
  }
}
