import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

export const BASE_URL: string = environment.baseURL;
export const RESOURCE_URL: string = 'api/v1/users';

@Injectable()

export class UsersService {
  form: FormGroup = new FormGroup({
    uuid: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    roles: new FormControl([]),
  });
  private API_ENDPOINT = `${BASE_URL}/${RESOURCE_URL}`;

  constructor(private http: HttpClient) {
  }

  /**
   * Get all users
   * @param param
   */
  getUsers(param?: { pageNo: number; pageSize: number; }): Observable<any> {
    return this.http.get<any>(this.API_ENDPOINT, {params: param}).pipe(
      map(this.extractData));
  }

  findById(param?: { id: string; }): Observable<any> {
    // @ts-ignore
    return this.http.get<any>(this.API_ENDPOINT + "/" + param.id, {}).pipe(
      map(this.extractData))
  }

  /**
   * Delete user by id
   * @param id
   */
  delete(id: string): Observable<any> {
    console.log("Deleting user with id ", id);
    return this.http.delete<any>(this.API_ENDPOINT + "/" + id).pipe(
      map(this.extractData));
  }

  /**
   *
   * @param data
   */
  populateForm(data: any) {
    this.form.patchValue(data);
  }

  initializeFormGroup() {
    return this.form.setValue({
      id: '',
      email: '',
      name: '',
      phone: '',
      username: '',
      roles: []
    });
  }

  /**
   * @param user
   */
  createUser(user: { name: any; }): Observable<any> {
    console.log(user);
    return this.http.post<any>(this.API_ENDPOINT + "/register", user)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(tap((response) => console.log(`Added user with name = ${user.name}`)),
        catchError(this.handleError<any>('create objective'))
      );
  }

  updateUser(user: { id: string; }): Observable<any> {
    return this.http.put(this.API_ENDPOINT + "/" + user.id, user)
      .pipe(tap(_ => console.log(`updated user with id=${user.id}`)),
        catchError(this.handleError<any>('update user'))
      );
  }

  compareObjects(o1: { id: any; }, o2: { id: any; }) {
    return o1 && o2 && o1.id === o2.id;
  }

  resetPassword(data: { value: { id: any; }; }): Observable<any> {
    return this.http.put(this.API_ENDPOINT + "/change-password", data.value)
      .pipe(tap(_ => console.log(`changed password for user with id=${data.value.id}`)),
        catchError(this.handleError<any>('change user password'))
      );
  }

  /**
   * helper function to extract data since
   * we are not using a type checker in the request
   * @returns Observable
   *
   * @param res
   */
  private extractData(res: Response) {
    const body = res;
    return body || {};
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
