import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {MenuItemApiResponse} from "./types/MenuItemApiResponse";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/menu-items';

@Injectable()

export class MenuItemService {
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
  get(params: { pageNo: number; pageSize: number; sortBy: string; }): Observable<MenuItemApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${params.pageNo}&size=${params.pageSize}&sort=${params.sortBy}`;
    return this._http.get<MenuItemApiResponse>(requestUrl);
  }

  delete(uuid: string): Observable<MenuItemApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}/${uuid}`;
    return this._http.delete<MenuItemApiResponse>(requestUrl);
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

  getByMenuUuid(uuid: string) {
    let requestUrl = `${this.API_ENDPOINT}/menu/${uuid}`;
    return this._http.get(requestUrl);
  }
}
