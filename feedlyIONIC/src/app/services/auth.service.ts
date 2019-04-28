import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const url = 'http://localhost:3000/api/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;

  constructor(private http: HttpClient) { }

  get headers() {
    return this.token ? new HttpHeaders().set('Authorization', this.token) : null;
  }

  register(user: any) {
    return this.http.post(url + 'auth/register', user).toPromise();
  }

  login(user: any) {
    return this.http.post(url + 'auth/login', user).toPromise();
  }
}
