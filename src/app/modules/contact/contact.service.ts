import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {SortDirection} from "@angular/material/sort";
import {ApiResponse} from "./contact.component";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/contacts';

@Injectable()

export class ContactService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    facilityCode: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    urn: new FormControl('', [Validators.required]),
    sex: new FormControl('', [Validators.required]),
    registrationDate: new FormControl('', [Validators.required]),
  });

  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;
  _http:HttpClient = inject(HttpClient);

  getContacts(page: number, size:number, sort: SortDirection): Observable<ApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}?page=${page}&size=${size}&sort=${sort}`;
    return this._http.get<ApiResponse>(requestUrl);
  }

  /**
   *
   * @param data
   */
  populateForm(data: { [key: string]: any; }) {
    this.form.patchValue(data);
    console.log("The received form data =>",this.form.value);
  }

  updateContact(contact: any) {
    return this._http.put(this.API_ENDPOINT + "/" + contact.uuid, contact)
      .pipe(tap(_ => console.log(`updated contact with uuid=${contact.uuid}`)),
        catchError(this.handleError<any>('update contact'))
      );
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      facilityCode: ''
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
