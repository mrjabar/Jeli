import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService {

  domain = 'http://localhost:8080';
  authToken;
  user;
  options;

  constructor(
    private http: HttpClient,
  ) { }

  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new HttpResponse({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: this.authToken
      })
    });
  }

  loadToken() {
    const token = localStorage.getItem('token');
    this.authToken = token;
  }

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

  login(user) {
    return this.http.post(this.domain + '/authentication/login', user)
      .pipe(map(res => res));
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // getProfile() {
  //   this.createAuthenticationHeaders();
  //   return this.http.get(this.domain + '/authentication/profile', this.options)
  //     .pipe(map(res => res));
  // }

  getProfile() {
    this.loadToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authToken
    });
    return this.http.get(this.domain + '/authentication/profile', {
      headers
    });
  }

  loggedIn() {
    if (localStorage.token == undefined ) {
     return false;
    } else {
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(localStorage.token);
    }
   }
}
