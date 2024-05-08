import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorityService {
  private baseUrl = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {
  }

  // Read
  get(params: { page: number; size: number; sort: string }): Observable<any> {
    return this.http.get(`${this.baseUrl}/authorities?page=${params.page}&size=${params.size}&sort=${params.sort}`);
  }
}
