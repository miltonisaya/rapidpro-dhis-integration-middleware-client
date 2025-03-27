import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ContactApiResponse} from "../contact/types/ContactApiResponse";
import {Observable} from "rxjs";

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/outbox';

@Injectable()

export class TransactionsService {
  private API_ENDPOINT: string = `${BASE_URL}/${RESOURCE_URL}`;
  _http: HttpClient = inject(HttpClient);

  get(): Observable<any> {
    const requestUrl: string = `${this.API_ENDPOINT}`;
    return this._http.get<ContactApiResponse>(requestUrl);
  }
}
