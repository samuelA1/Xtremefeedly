import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const url = 'http://localhost:3000/api/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;
  constructor(private http: HttpClient) { }

  register(user: any) {
    return this.http.post(url + 'auth/register', user).toPromise().then((res) => {
      this.token = res['token'];
      return res;
    });
  }

  login(user: any) {
    return this.http.post(url + 'auth/login', user).toPromise().then((res) => {
      this.token = res['token'];
      return res;
    });;
  }
}
