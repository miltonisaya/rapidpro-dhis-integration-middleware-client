import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import {SortDirection} from "@angular/material/sort";
import {ApiResponse} from "../contact/contact.component";

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  private API_ENDPOINT = `${environment.baseURL}/api/v1/flows`;
  private syncApiEndpoint = `${environment.baseURL}/api/v1/flows/sync`;
  private keysByFlowIdEndpoint = `${environment.baseURL}/api/v1/flows/get-rapid-pro-flow-keys-by-flow-id`;
  private resetMappingEndpoint = `${environment.baseURL}/api/v1/flows/reset-mapping`;

  constructor(private _http: HttpClient) { }

  get(params: { pageNo: number; pageSize: number; sortBy: string }): Observable<ApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?pageNumber=${params.pageNo}&pageSize=${params.pageSize}&sortBy=${params.sortBy}`;
    return this._http.get<ApiResponse>(requestUrl);
  }

  syncFlows(): Observable<any> {
    return this._http.get<any>(this.syncApiEndpoint)
      .pipe(
        catchError(this.handleError('syncFlows', []))
      );
  }

  findKeysWithCategoriesByFlowUuid(uuid: string): Observable<any> {
    const requestUrl = `${environment.baseURL}/api/v1/keys/flow/${uuid}`;
    return this._http.get<ApiResponse>(requestUrl);
  }

  resetMapping(uuid: string): Observable<any> {
    return this._http.put<any>(`${this.resetMappingEndpoint}/${uuid}`, { uuid })
      .pipe(
        tap(_ => console.log(`Reset mapping for flow with uuid=${uuid}`)),
        catchError(this.handleError('resetMapping'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);  // log to console
      return of(result as T);  // Let the app keep running by returning a safe result.
    };
  }
}
