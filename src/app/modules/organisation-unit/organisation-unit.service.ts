import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganisationUnitService {
  private baseUrl = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {
  }

  // Create
  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // Read
  get(): Observable<any> {
    return this.http.get(`${this.baseUrl}/organisation-units/parent-organisation-units`);
  }

  //Get children by parent uuid
  findChildrenByParentUuid(parentUuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/organisation-units/children/${parentUuid}`);
  }

  // Update
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/items/${id}`, data);
  }

  // Delete
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${id}`);
  }
}
