import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProgramApiResponse} from "./program.component";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/programs';
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
    return this._http.get<ProgramApiResponse>(requestUrl);
  }

  mapDataElements(payload: any): Observable<any> {
    let requestUrl = `${BASE_URL}/programs/map-data-elements`;
    return this._http.post<ProgramApiResponse>(requestUrl, payload);
  }
}
