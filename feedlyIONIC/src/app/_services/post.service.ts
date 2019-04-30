import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const url = "http://localhost:3000/api/"

@Injectable({
  providedIn: 'root'
})
export class PostService {
  token: any;

  constructor(private storage: Storage, private http: HttpClient) { }

  get headers() {
    this.storage.get('token').then((token) => this.token = token );
    return this.token ? new HttpHeaders().set('Authorization', this.token) : null;
  }

  addPost(post: any) {
    return this.http.post(url + 'post/posts', post, {headers: this.headers}).toPromise();
  }
}
