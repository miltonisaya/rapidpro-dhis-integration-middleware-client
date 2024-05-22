import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';
import {FlowApiResponse} from "./types/FlowApiResponse";

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  private API_ENDPOINT: string = `${environment.baseURL}/api/v1/flows`;

  constructor(private _http: HttpClient) {
  }

  get(params: { pageNo: number; pageSize: number; sortBy: string }): Observable<FlowApiResponse> {
    const requestUrl: string = `${this.API_ENDPOINT}?pageNumber=${params.pageNo}&pageSize=${params.pageSize}&sortBy=${params.sortBy}`;
    return this._http.get<FlowApiResponse>(requestUrl);
  }

  syncFlows(): Observable<any> {
    const requestUrl = `${environment.baseURL}/api/v1/flows/sync`;
    return this._http.get<any>(requestUrl);
  }

  findKeysWithCategoriesByFlowUuid(uuid: string): Observable<any> {
    const requestUrl: string = `${environment.baseURL}/api/v1/keys/flow/${uuid}`;
    return this._http.get<FlowApiResponse>(requestUrl);
  }

  resetMapping(uuid: string): Observable<any> {
    const requestUrl: string = `${environment.baseURL}/api/v1/keys/reset-mapping/${uuid}`;
    return this._http.put<any>(requestUrl, {uuid});
  }
}
