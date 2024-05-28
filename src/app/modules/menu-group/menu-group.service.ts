import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {MenuApiResponse} from "./types/MenuApiResponse";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/menus';

@Injectable()

export class MenuGroupService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    icon: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    sortOrder: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"),
    ])
  });

  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  _http: HttpClient = inject(HttpClient);

  /**
   *
   * @param params
   */
  get(params: { pageNo: number; pageSize: number; sortBy: string; }): Observable<MenuApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${params.pageNo}&size=${params.pageSize}&sort=${params.sortBy}`;
    return this._http.get<MenuApiResponse>(requestUrl);
  }

  delete(uuid: string): Observable<MenuApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}/${uuid}`;
    return this._http.delete<MenuApiResponse>(requestUrl);
  }

  /**
   *
   * @param data
   */
  populateForm(data: { [key: string]: any; }) {
    this.form.patchValue(data);
  }

  update(data: any): Observable<any> {
    console.log('Payload Update =>', data);
    return this._http.put(`${this.API_ENDPOINT}/${data.uuid}`, data);
  }

  findUnAssignedAuthoritiesByRoleUuid(roleUuid: string): Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/authorities/${roleUuid}`);
  }

  initializeFormGroup() {
    return this.form.patchValue({
      id: '',
      name: '',
      icon: '',
      url: '',
      sortOrder: '',
    });
  }

  create(payload: any): Observable<any> {
    return this._http.post(`${this.API_ENDPOINT}`, payload);
  }
}