import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { PostModalPage } from '../post-modal/post-modal.page';
import { PostService } from '../_services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-streams',
  templateUrl: './streams.page.html',
  styleUrls: ['./streams.page.scss'],
})
export class StreamsPage implements OnInit {
  stream: any = {};
  posts: any[];
  tabElement: any;
  user: any;
  socket: any;

  constructor(private modalCtrl: ModalController,
     private alertCtrl: AlertController,
     private postService: PostService,
     private toastCtrl: ToastController) {
    this.tabElement = document.querySelector('.tabar'); 
    this.stream = "post"
    this.socket = io('http://localhost:3000')
  }

  async geAllPost() {
    try {
      const postInfo = await this.postService.getAllPost();
      if (postInfo['success']) {
        this.posts = postInfo['posts'];
        console.log(postInfo['posts'])
        this.user = postInfo['user'];
      } else {
        await this.presentAlert('Unable to retrieve all posts');
      }
    } catch (error) {
      await this.presentAlert('Unable to retrieve all posts');
    }
  }
  segmentChanged(ev: any) {
    this.stream = `${ev.detail.value}`
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: PostModalPage,
    });
    return await modal.present();
  }

  async callModal() {
    await this.presentModal();
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Stream Error',
      message: `${message}`,
      buttons: ['OK'],
      cssClass: 'alertCss'
    });

    return await alert.present();
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }

  async likePost(postId: any, post: any) {
    try {
      if (post['isLiked']) {
        const unlikeInfo = await this.postService.unlikePost(postId);
        if (unlikeInfo['success']) {
          this.presentToast(unlikeInfo['message']);
          post['isLiked'] = false;
          this.socket.emit('like', postId);
        } else {
          await this.presentAlert('Sorry, an error occuured while trying to send like a post')
        }
      } else {
        const likeInfo = await this.postService.likePost(postId);
        if (likeInfo['success']) {
          this.presentToast(likeInfo['message']);
          post['isLiked'] = true;
          this.socket.emit('like', postId);
        } else {
          await this.presentAlert('Sorry, an error occuured while trying to send like a post')
        }
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occuured while trying to send like a post')
    }
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  async ngOnInit() {
    if (this.tabElement) {
      (this.tabElement as HTMLElement).style.display = 'flex'
    }
    await this.geAllPost();
    this.socket.on('refreshPage', async post => {
      await this.geAllPost();
    })

    this.socket.on('likedPage', async post => {
      await this.geAllPost();
    })
  }

}
