import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Authority} from "./types/Authority";

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8081/api/v1';

  form: FormGroup = this.fb.group({
    roleUuid: this.fb.control('', Validators.required),
    authorities: this.fb.array([])
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
  }

  initializeFormGroup(roleUuid: string) {
    this.form.patchValue({
      roleUuid: roleUuid,
      authorities: []
    });
  }

  async addItemToAuthorities(authorities: any) {
    authorities.map((authority: Authority) => {
      const item = this.fb.group({
        uuid: this.fb.control(authority.uuid),
        name: this.fb.control(authority.name),
        action: this.fb.control(authority.action),
        resource: this.fb.control(authority.resource)
      });
      this.authorities.push(item);
    });
    return this.authorities;
  }

  get authorities() {
    return this.form.get('authorities') as FormArray;
  }

  findByRole(uuid: string): Observable<any> {
    let requestUrl = `${this.baseUrl}/authorities/role/${uuid}`;
    return this.http.get(requestUrl);
  }
  saveRoleAuthorities(payload: { roleUuid: any; authorityIds: number[] }): Observable<any> {
    let requestUrl = `${this.baseUrl}/authorities/role-authorities`;
    return this.http.post(requestUrl, payload);
  }
}
