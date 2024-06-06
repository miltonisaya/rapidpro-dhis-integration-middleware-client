import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
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
   * @param params
   */
  get(params: { pageNo: number; pageSize: number; sortBy: string; }): Observable<RoleApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${params.pageNo}&size=${params.pageSize}&sort=${params.sortBy}`;
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
    console.log('Payload Update =>', data);
    return this._http.put(`${this.API_ENDPOINT}/${data.uuid}`, data);
  }

  initializeFormGroup() {
    return this.form.patchValue({
      id: '',
      name: '',
      code: '',
      description: '',
    });
  }

  create(payload: any): Observable<any> {
    return this._http.post(`${this.API_ENDPOINT}`, payload);
  }

  findByUuid(uuid: string):Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/${uuid}`);
  }
}
