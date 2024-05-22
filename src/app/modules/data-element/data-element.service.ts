import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponse} from "../contact/contact.component";

export const BASE_URL: string = environment.baseURL;

@Injectable()
export class DataElementService {
  constructor(private _http: HttpClient) {
  }

  getDataElements(params?: any): Observable<any> {
    const requestUrl = `${BASE_URL}/api/v1/data-elements?pageNumber=${params.pageNo}&pageSize=${params.pageSize}&sortBy=${params.sortBy}`;

    return this._http.get<ApiResponse>(requestUrl);
  }

  syncDataElements() {
    const requestUrl = `${BASE_URL}/api/v1/data-elements/sync-data-elements}`;
    return this._http.get<ApiResponse>(requestUrl);
  }
}