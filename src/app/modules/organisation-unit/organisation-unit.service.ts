import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrganisationUnit} from "./types/OrganisationUnit";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/organisation-units';

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  private API_ENDPOINT: string = `${BASE_URL}/${RESOURCE_URL}`;
  _http: HttpClient = inject(HttpClient);


  // Create
  create(data: any): Observable<any> {
    return this._http.post(`${this.API_ENDPOINT}`, data);
  }

  // Read
  get(): Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/parent-organisation-units`);
  }

  //Get children by parent uuid
  findChildrenByParentUuid(parentUuid: string): Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/children/${parentUuid}`);
  }

  // Update
  update(id: number, data: any): Observable<any> {
    return this._http.put(`${this.API_ENDPOINT}/${id}`, data);
  }

  // Delete
  delete(id: number): Observable<any> {
    return this._http.delete(`${this.API_ENDPOINT}/${id}`);
  }

  search(query: { page: number; size: number; sort: string; name: string; }): Observable<OrganisationUnit[]> {
    return this._http.get<any>(`${this.API_ENDPOINT}`, {params: query}).pipe(
      map(response => {
        return response.data || []; // Handle cases where `data` might be undefined
      }),
      catchError(err => {
        return [];
      })
    );
  }
}
