import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {SortDirection} from "@angular/material/sort";
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

  get(page: number, size: number, sort: SortDirection): Observable<RoleApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}`;
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
    console.log("The received form data =>", this.form.value);
  }

  update(contact: any) {
    return this._http.put(this.API_ENDPOINT + "/" + contact.uuid, contact)
      .pipe(tap(_ => console.log(`updated role with uuid=${contact.uuid}`)),
        catchError(this.handleError<any>('update role'))
      );
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      name: '',
      code: '',
      description: ''
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
