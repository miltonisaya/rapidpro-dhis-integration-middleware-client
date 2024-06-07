import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlowKeyService {
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    dataElementId: new FormControl('', Validators.required),
    rapidProFlowId: new FormControl('', Validators.required)
  });

  private baseUrl: string = environment.baseURL;

  constructor(private http: HttpClient) {
  }

  getKeysByFlowUuid(uuid: string): Observable<any> {
    let requestUrl = `${this.baseUrl}/api/v1/get-rapid-pro-flow-keys-by-flow-id/${uuid}`;
    return this.http.get<any>(requestUrl);
  }

  updateFlowKey(flowKey: any): Observable<any> {
    let requestUrl = `${this.baseUrl}/api/v1/flows/${flowKey.id}`;
    return this.http.put<any>(requestUrl, flowKey);
  }

  mapDataElement(data: any): Observable<any> {
    let requestUrl = `${this.baseUrl}/api/v1/map-data-element`;
    return this.http.put<any>(requestUrl, data);
  }

  mapDataElementsWithCategory(data: any): Observable<any> {
    let requestUrl: string = `${this.baseUrl}/api/v1/map-data-element-with-category/${data.categoryUuid}`;
    return this.http.put<any>(requestUrl, data);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);  // log to console
      return of(result as T);  // Let the app keep running by returning a safe result.
    };
  }
}
