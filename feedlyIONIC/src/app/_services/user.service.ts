import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const url = "http://localhost:3000/api/"


@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: any;

  constructor(private http: HttpClient, private storage: Storage) { }

  async headers() {
    this.token = await this.storage.get('token');
    return this.token ? new HttpHeaders().set('Authorization', this.token) : null;
  }

  async getUserProfile() {
    return this.http.get(url + 'profile/getUser', {headers: await this.headers()}).toPromise();
  }
}
