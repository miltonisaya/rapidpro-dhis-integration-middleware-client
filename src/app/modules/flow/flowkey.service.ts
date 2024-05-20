import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';

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
  private resourceUrl: string = `${this.baseUrl}/api/v1/rapidpro-flows`;
  private syncResourceUrl: string = `${this.baseUrl}/api/v1/sync-rapidpro-flows`;
  private keysByFlowIdUrl: string = `${this.baseUrl}/api/v1/get-rapid-pro-flow-keys-by-flow-id`;
  private mapDataElementUrl: string = `${this.baseUrl}/api/v1/map-data-element`;
  private mapDataElementWithCategoryUrl: string = `${this.baseUrl}/api/v1/flows/map-data-element-with-category`;

  constructor(private http: HttpClient) { }

  getFlows(params?: any): Observable<any> {
    return this.http.get<any>(this.resourceUrl, { params })
      .pipe(
        catchError(this.handleError('getFlows', []))
      );
  }

  syncFlows(): Observable<any> {
    return this.http.get<any>(this.syncResourceUrl)
      .pipe(
        catchError(this.handleError('syncFlows', []))
      );
  }

  getKeysByFlowUuid(uuid: string): Observable<any> {
    return this.http.get<any>(`${this.keysByFlowIdUrl}/${uuid}`)
      .pipe(
        catchError(this.handleError('getKeysByFlowId', {}))
      );
  }

  populateForm(data: any): void {
    this.form.setValue(data);
  }

  updateFlowKey(flowKey: any): Observable<any> {
    return this.http.put<any>(`${this.resourceUrl}/${flowKey.uuid}`, flowKey)
      .pipe(
        tap(_ => console.log(`Updated flow key with uuid=${flowKey.uuid}`)),
        catchError(this.handleError('updateFlowKey'))
      );
  }

  mapDataElement(data: any): Observable<any> {
    return this.http.put<any>(this.mapDataElementUrl, data)
      .pipe(
        tap(_ => console.log(`Mapped flow key with data element=${data.dataElementUuid}`)),
        catchError(this.handleError('mapDataElement'))
      );
  }

  mapDataElementsWithCategory(data: any): Observable<any> {
    return this.http.put<any>(`${this.mapDataElementWithCategoryUrl}/${data.categoryUuid}`, data)
      .pipe(
        tap(_ => console.log(`Mapped flow data elements with category=${data.categoryUuid}`)),
        catchError(this.handleError('mapDataElementsWithCategory'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);  // log to console
      return of(result as T);  // Let the app keep running by returning a safe result.
    };
  }
}
