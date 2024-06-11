import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/keys';

@Injectable({
  providedIn: 'root'
})

export class FlowKeyService {
  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    dataElementId: new FormControl('', Validators.required),
    rapidProFlowId: new FormControl('', Validators.required)
  });

  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

  getKeysByFlowUuid(uuid: string): Observable<any> {
    let requestUrl = `${this.API_ENDPOINT}/get-rapid-pro-flow-keys-by-flow-id/${uuid}`;
    return this.http.get<any>(requestUrl);
  }

  updateFlowKey(flowKey: any): Observable<any> {
    let requestUrl = `${this.API_ENDPOINT}/flow/${flowKey.id}`;
    return this.http.put<any>(requestUrl, flowKey);
  }

  mapDataElement(data: any): Observable<any> {
    let requestUrl = `${this.API_ENDPOINT}/map-data-element`;
    return this.http.put<any>(requestUrl, data);
  }

  mapDataElementsWithCategory(data: any): Observable<any> {
    let requestUrl: string = `${this.API_ENDPOINT}/map-data-element-with-category/${data.categoryUuid}`;
    return this.http.put<any>(requestUrl, data);
  }
}
