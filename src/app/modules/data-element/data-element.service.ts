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

  getDataElements(param?: any): Observable<any> {
    const requestUrl = `${BASE_URL}/api/v1/data-elements}`;
    return this._http.get<ApiResponse>(requestUrl, param);
  }

  syncDataElements() {
    const requestUrl = `${BASE_URL}/api/v1/data-elements/sync-data-elements}`;
    return this._http.get<ApiResponse>(requestUrl);
  }
}
