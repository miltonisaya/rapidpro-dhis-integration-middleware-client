import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Authority } from './types/Authority';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8081/api/v1';
  form: FormGroup = new FormGroup({
    roleUuid: new FormControl('', Validators.required),
    authorities: new FormArray([])
  });

  constructor(private http: HttpClient) {}

  initializeFormGroup(roleUuid: string) {
    this.form.patchValue({
      roleUuid: roleUuid,
      authorities: []
    });
  }

  initAuthorities(data: any) {
    const authoritiesFormArray = this.form.get('authorities') as FormArray;
  }

  createAuthorityControl(authority: Authority): FormGroup {
    return new FormGroup({
      name: new FormControl(authority.name),
      uuid: new FormControl(authority.uuid),
      action: new FormControl(authority.action),
      resource: new FormControl(authority.resource),
    });
  }

  findByRole(uuid: string): Observable<any> {
    let requestUrl = `${this.baseUrl}/authorities/role/${uuid}`;
    return this.http.get(requestUrl);
  }
}
