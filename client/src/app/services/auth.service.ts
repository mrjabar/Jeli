import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  domain = 'http://localhost:8080';

  constructor(
    private http: HttpClient,

  ) { }

  registerUser(user) {
    return this.http.post(this.domain + '/authentication/register', user)
      .pipe(map(res => res));
  }

  checkEmail(email) {
    return this.http.get(this.domain + '/authentication/checkEmail/' + email)
      .pipe(map(res => res));
  }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username)
      .pipe(map(res => res));
  }



}
