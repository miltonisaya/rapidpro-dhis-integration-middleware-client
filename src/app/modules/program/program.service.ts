import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ApiResponse} from "../contact/contact.component";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/programs';
export const SYNC_RESOURCE_URL: string = 'api/v1/sync-programs';
export const MAP_DATA_ELEMENTS_RESOURCE: string = 'map-data-elements';

// { pageNo: number; pageSize: number; sortBy: string; }

@Injectable()
export class ProgramService {
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private _http: HttpClient) {
  }

  getDataElements(param?: any): Observable<any> {
    return this._http.get<any>(this.API_ENDPOINT, {params: param});
  }

  syncPrograms() {
    let requestUrl = `${BASE_URL}/api/v1/programs/sync-programs`;
    return this._http.get<ApiResponse>(requestUrl);
  }

  mapDataElements(payload: any): Observable<any> {
    let requestUrl = `${BASE_URL}/programs/map-data-elements`;
    return this._http.post<ApiResponse>(requestUrl, payload);
  }
}
