import { PostService } from './../_services/post.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import * as _ from 'lodash';


@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.page.html',
  styleUrls: ['./comment-modal.page.scss'],
})
export class CommentModalPage implements OnInit {
  comment: any = {};
  isDisabled: boolean = true;
  socket: any;
  comments: any[];
  @Input() postId: any;

  constructor(private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private postService: PostService,
    private alertCtrl: AlertController
    ) {
      this.socket = io('http://localhost:3000');
      
     }

  async ngOnInit() {
    await this.getComments();
    this.socket.on('commentPage', async (comment: any) => {
      await this.getComments();
    });
  }

  async addComment() {
    try {
      const commentInfo = await this.postService.addComment(this.comment, this.postId);
      if (commentInfo['success']) {
        this.socket.emit('comment', this.comment);
        this.comment.comment = '';
        this.isDisabled = true;
        await this.presentToast(commentInfo['message']);
      } else {
        await this.presentAlert('Sorry, an error occured while trying to comment on a post');
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occured while trying to comment on a post');
    }
  }

  async getComments() {
    try {
      const commentsInfo = await this.postService.getComments(this.postId);
      if (commentsInfo['success']) {
        this.comments =_.orderBy(commentsInfo['comments']['comments'], ['createdAt'], ['desc']);
      } else {
        await this.presentAlert('Sorry, an error occured while trying to get comments')
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occured while trying to get comments')
    }
  }


  disableBtn() {
    this.isDisabled = false;
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Post Error',
      message: `${message}`,
      buttons: ['OK'],
      cssClass: 'alertCss'
    });

    return await alert.present();
  }

  removeModal() {
    this.modalCtrl.dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  GetPostTime(time) {
    return moment(time).fromNow();
  }

}
