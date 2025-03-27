import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {DataElementApiResponse} from "./data-element.component";

export const BASE_URL: string = environment.baseURL;

@Injectable()
export class DataElementService {
  constructor(private _http: HttpClient) {
  }

  getDataElements(params?: any): Observable<any> {
    const requestUrl = `${BASE_URL}/api/v1/data-elements?pageNumber=${params.pageNo}&pageSize=${params.pageSize}&sortBy=${params.sortBy}`;
    return this._http.get<DataElementApiResponse>(requestUrl);
  }

  getDataElementsByProgram(programUuid: string): Observable<any> {
    const requestUrl = `${BASE_URL}/api/v1/data-elements/data-element-programs/${programUuid}`;
    return this._http.get<DataElementApiResponse>(requestUrl);
  }

  syncDataElements() {
    const requestUrl = `${BASE_URL}/api/v1/data-elements/sync-data-elements`;
    return this._http.get<DataElementApiResponse>(requestUrl);
  }
}
