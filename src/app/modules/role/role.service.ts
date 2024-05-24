import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {SortDirection} from "@angular/material/sort";
import {RoleApiResponse} from "./types/RoleApiResponse";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/roles';

@Injectable()

export class RoleService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  _http: HttpClient = inject(HttpClient);

  /**
   *
   * @param page
   * @param size
   * @param sort
   */
  get(page: number, size: number, sort: string): Observable<RoleApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}`;
    return this._http.get<RoleApiResponse>(requestUrl);
  }

  delete(uuid: string): Observable<RoleApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}/${uuid}`;
    return this._http.delete<RoleApiResponse>(requestUrl);
  }

  /**
   *
   * @param data
   */
  populateForm(data: { [key: string]: any; }) {
    this.form.patchValue(data);
  }

  update(data: any): Observable<any> {
    console.log('Payload Update =>',data);
    return this._http.put(`${this.API_ENDPOINT}/${data.uuid}`, data);
  }

  findUnAssignedAuthoritiesByRoleUuid(roleUuid:string):Observable<any>{
    return this._http.get(`${this.API_ENDPOINT}/authorities/${roleUuid}`);
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      name: '',
      code: '',
      description: '',
    });
  }

  create(payload: any):Observable<any> {
    return this._http.put(`${this.API_ENDPOINT}/roles`, payload);
  }
}
