import { PostService } from './../_services/post.service';
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import * as io from 'socket.io-client';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Storage } from '@ionic/storage';


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
  userId: any;
  @Input() postId: any;

  constructor(private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private postService: PostService,
    private alertCtrl: AlertController,
    private actionSheetController: ActionSheetController,
    private storage: Storage
    ) {
      this.socket = io('http://localhost:3000');
      
     }

  async ngOnInit() {
    this.userId = await this.storage.get('userId');
    await this.getComments();
    this.socket.on('commentPage', async (comment: any) => {
      await this.getComments();
    });

    this.socket.on('deleteCommentPage', async (data: any) => {
      await this.getComments();
    })
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

  async deleteComment(commentId: any) {
    try {
      const commentDelete = await this.postService.deleteComment(this.postId, commentId);
      if (commentDelete['success']) {
        this.socket.emit('deleteComment', commentId);
        this.socket.emit('comment', commentId);
        await this.presentToast(commentDelete['message']);
      } else {
        await this.presentAlert(' Sorry, an error occured while trying to delete a post');
      }
    } catch (error) {
      await this.presentAlert(' Sorry, an error occured while trying to delete a post');
    }
  }

  async removeComment(commentId: any) {
    await this.presentActionSheet(commentId)
  }

  async presentActionSheet(commentId: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Comment',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          await this.deleteComment(commentId)
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }


  disableBtn() {
    this.isDisabled = false;
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Comment Error',
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
