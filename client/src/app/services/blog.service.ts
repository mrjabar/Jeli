import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class BlogService {

  domain = this.authService.domain;
  authToken;
  user;
  options;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken();
    this.options = new HttpResponse({
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: this.authService.authToken
      })
    });
  }

  newBlog(blog) {
    this.createAuthenticationHeaders();
    return this.http.post(this.domain + 'blogs/newBlog', blog, this.options)
      .pipe(map(res => res));

  }

  getAllBlogs() {
    this.createAuthenticationHeaders();
    return this.http.get(this.domain + 'blogs/allBlogs', this.options)
    .pipe(map(res => res));


  }

}

