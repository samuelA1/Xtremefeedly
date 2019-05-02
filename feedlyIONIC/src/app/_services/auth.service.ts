import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const url = 'http://localhost:3000/api/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any;
  constructor(private http: HttpClient, private storage: Storage) { }

  register(user: any) {
    return this.http.post(url + 'auth/register', user).toPromise().then((res) => {
      this.storage.set('token', res['token']);
      this.token = res['token'];
      return res;
    });
  }

  login(user: any) {
    return this.http.post(url + 'auth/login', user).toPromise().then((res) => {
      this.storage.set('token', res['token']);
      this.token = res['token'];
      return res;
    });;
  }
}
