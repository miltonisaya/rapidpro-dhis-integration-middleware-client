import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from './types/User';
import {UserApiResponse} from './types/UserApiResponse';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/users';

@Injectable()

export class UserService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    roles: new FormControl([], Validators.required),
    organisationUnit: new FormControl('', [Validators.required]),
  });
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all users
   * @param param
   */
  getUsers(param?: { pageNo: number; pageSize: number; }): Observable<UserApiResponse> {
    const params = param ? { pageNo: String(param.pageNo), pageSize: String(param.pageSize) } : undefined;
    return this.http.get<UserApiResponse>(this.API_ENDPOINT, { params });
  }

  /**
   * Delete user by id
   * @param id
   */
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.API_ENDPOINT + "/" + id);
  }

  /**
   * @param data
   */
  populateForm(data: Partial<User>): void {
    this.form.patchValue(data);
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      email: '',
      name: '',
      phone: '',
      roles: [],
      organisationUnit:''
    });
  }

  create(payload: Partial<User>): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_ENDPOINT}`, payload);
  }

  updateUser(user: Partial<User> & { uuid: string }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.API_ENDPOINT + "/" + user.uuid, user)
      .pipe(catchError(this.handleError<{ message: string }>('update user')));
  }

  compareObjects(o1: { id: string }, o2: { id: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  resetPassword(data: { value: { id: string } }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.API_ENDPOINT + "/change-password", data.value)
      .pipe(catchError(this.handleError<{ message: string }>('change user password')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }
}
