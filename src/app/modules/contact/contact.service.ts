import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {ContactApiResponse} from "./types/ContactApiResponse";
import {RoleApiResponse} from "../role/types/RoleApiResponse";

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

  private API_ENDPOINT: string = `${BASE_URL}/${RESOURCE_URL}`;
  _http: HttpClient = inject(HttpClient);

  get(params: { pageNo: number; pageSize: number; sortBy: string }): Observable<ContactApiResponse> {
    const requestUrl: string = `${this.API_ENDPOINT}?page=${params.pageNo}&size=${params.pageSize}&sort=${params.sortBy}`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }

  /**
   *
   * @param data
   */
  populateForm(data: { [key: string]: any; }) {
    this.form.patchValue(data);
    console.log("The received form data =>", this.form.value);
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

  getTotalRegisteredClients(): Observable<any> {
    const requestUrl: string = `${this.API_ENDPOINT}/registrations-by-user-organisation-unit`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }

  getTotalRegisteredClientsThisYear(): Observable<any> {
    const requestUrl: string = `${this.API_ENDPOINT}/registrations-user-organisation-unit-this-year`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }

  getTotalRegisteredClientsThisMonth(): Observable<any> {
    const requestUrl: string = `${this.API_ENDPOINT}/registrations-user-organisation-unit-this-month`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }

  getTotalRegisteredClientsThisToday(): Observable<any> {
    const requestUrl: string = `${this.API_ENDPOINT}/registrations-user-organisation-unit-today`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }

  create(payload: any): Observable<any> {
    return this._http.post(`${this.API_ENDPOINT}`, payload);
  }

  update(data: any): Observable<any> {
    console.log('Payload Update =>', data);
    return this._http.put(`${this.API_ENDPOINT}/${data.uuid}`, data);
  }

  delete(uuid: string): Observable<RoleApiResponse> {
    const requestUrl = `${this.API_ENDPOINT}/${uuid}`;
    return this._http.delete<RoleApiResponse>(requestUrl);
  }
}
