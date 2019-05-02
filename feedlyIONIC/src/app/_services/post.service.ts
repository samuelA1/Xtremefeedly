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

  async headers() {
    this.token = await this.storage.get('token');
    return this.token ? new HttpHeaders().set('Authorization', this.token) : null;
  }

  async addPost(post: any) {
    return this.http.post(url + 'post/posts', post, {headers: await this.headers()}).toPromise();
  }

  async getAllPost() {
    return this.http.get(url + 'post/posts', {headers: await this.headers()}).toPromise();
  }

  async likePost(postId) {
    return this.http.post(url + `likes/${postId}`, {}, {headers: await this.headers()}).toPromise();
  }
}
