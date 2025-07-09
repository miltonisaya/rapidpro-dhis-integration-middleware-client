import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/organisation-units';

interface OrganisationUnit {
  id?: string;
  name: string;
  code: string;
  otherNames?: string;
  parentId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    otherNames: new FormControl(''),
    parentId: new FormControl('')
  });

  private _http: HttpClient = inject(HttpClient);
  private API_ENDPOINT: string = `${BASE_URL}/${RESOURCE_URL}`;

  create(data: OrganisationUnit): Observable<any> {
    return this._http.post(this.API_ENDPOINT, data);
  }

  get(): Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/parent-organisation-units`);
  }

  findChildrenByParentUuid(parentUuid: string): Observable<any> {
    return this._http.get(`${this.API_ENDPOINT}/children/${parentUuid}`);
  }

  update(id: string, data: OrganisationUnit): Observable<any> {
    return this._http.put(`${this.API_ENDPOINT}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this._http.delete(`${this.API_ENDPOINT}/${id}`);
  }

  search(query: { page: number; size: number; sort: string; name: string }): Observable<OrganisationUnit[]> {
    return this._http.get<any>(this.API_ENDPOINT, {params: query}).pipe(
      map(response => response.data || []),
      catchError(() => of([]))
    );
  }

  getChildren(id: string | number, param?: any): Observable<any> {
    return this._http.get<any>(`${this.API_ENDPOINT}/${id}/children`, {params: param})
      .pipe(map(this.extractData));
  }

  getCouncils(param?: any): Observable<any> {
    return this._http.get<any>(`${this.API_ENDPOINT}/councils`, {params: param}).pipe()
      .pipe(map(this.extractData));
  }

  populateForm(data: any) {
    this.form.patchValue(data);
  }

  initializeFormGroup() {
    this.form.reset({
      id: '',
      name: '',
      code: '',
      parentId: '',
      otherNames: ''
    });
  }

  // Fetch root organisation units (no parent)
  getRootOrganisationUnits(param?: any): Observable<any> {
    return this._http
      .get<any>(`${this.API_ENDPOINT}/root`, {params: param})
      .pipe(map(this.extractData));
  }

  private extractData(res: any) {
    return res || {};
  }
}
