import { CommentModalPage } from './../comment-modal/comment-modal.page';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, AlertController, ToastController, IonContent, ActionSheetController } from '@ionic/angular';
import { PostService } from '../_services/post.service';
import * as moment from 'moment';
import * as io from 'socket.io-client';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-streams',
  templateUrl: './streams.page.html',
  styleUrls: ['./streams.page.scss'],
})

export class StreamsPage implements OnInit, OnDestroy {
  @ViewChild(IonContent) ionContent: IonContent
  stream: any = {};
  posts: any[];
  userId: any;
  tabElement: any;
  fabElement: any;
  socket: any;
  page: any = 1;
  totalPost: any;
  topPosts: any[];
  totalPages: any;
  subscription: Subscription

  constructor(private modalCtrl: ModalController,
     private alertCtrl: AlertController,
     private postService: PostService,
     private toastCtrl: ToastController,
     private actionSheetController: ActionSheetController,
     private storage: Storage) {
    this.tabElement = document.querySelector('.tabar'); 
    this.fabElement = document.querySelector('.post-fab'); 
    this.stream = "post"
    this.socket = io('http://localhost:3000');
    this.subscription = this.postService.controlToTop$.subscribe(
      control => {
        if (control == true) {
          this.scrollToTop();
        }
    });
  }

  async getAllPost(page: any) {
    try {
      const postInfo = await this.postService.getAllPost(page);
      if (postInfo['success']) {
        this.posts = postInfo['posts'];
        console.log(this.posts)
        this.totalPost = postInfo['totalPosts'];
        this.topPosts = postInfo['topPosts'];
        this.totalPages = postInfo['totalPages'];
      } else {
        await this.presentAlert('Unable to retrieve all posts');
      }
    } catch (error) {
      await this.presentAlert('Unable to retrieve all posts');
    }
  }

  loadData(event: any) {
    this.page++
    setTimeout(() => {
      this.postService.getAllPost(this.page).then((postInfo) => {
        // postInfo['posts'].forEach((post: any) => {
        //   this.posts.push(post)
        //   console.log(this.posts)
        // });
        event.target.complete();
      });
  
      if (this.posts.length == this.totalPost) {
        event.target.disabled = true;
      }
    }, 800);
  }

  segmentChanged(ev: any) {
    this.stream = `${ev.detail.value}`
  }

  
  async presentCommentModal(postId: any) {
    const modal = await this.modalCtrl.create({
      component: CommentModalPage,
      componentProps: {postId: postId}
    });
    return await modal.present();
  }

  async callCommentModal(postId: any) {
    await this.presentCommentModal(postId);
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
          this.socket.emit('like', post)
          
        } else {
          await this.presentAlert('Sorry, an error occuured while trying to like a post')
        }
      } else {
        const likeInfo = await this.postService.likePost(postId);
        if (likeInfo['success']) {
          this.presentToast(likeInfo['message']);
          this.socket.emit('like', post)          
        } else {
          await this.presentAlert('Sorry, an error occuured while trying to like a post')
        }
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occuured while trying to like a post')
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

  async removePost(postId) {
    try {
      const deletePost = await this.postService.deletePost(postId);
      if (deletePost['success']) {
        this.presentToast('Post deleted successfully')
        this.socket.emit('delete', {});
      } else {
        await this.presentAlert('Sorry, an error occured while trying to delete a post');
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occured while trying to delete a post');
    }
  }

  async presentActionSheet(postId: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Post',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: async () => {
          await this.removePost(postId)
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

  async deletePost(postId: any) {
    await this.presentActionSheet(postId);
  }


  scrollToTop() {
    this.ionContent.scrollToTop();
  }

  endScroll() {
    this.postService.triggerToTop(false);
  }

  async ngOnInit() {
    if (this.tabElement) {
      (this.tabElement as HTMLElement).style.display = 'flex'
    }
    if (this.fabElement) {
      (this.fabElement as HTMLElement).style.display = 'flex'
    }
    await this.getAllPost(this.page);
    this.socket.on('refreshPage', async post => {
      await this.getAllPost(1);
      setTimeout(() => {
        this.postService.triggerToTop('yes');
        this.presentToast('New post available');
      }, 1000);
    })

    this.socket.on('commentPage', async (comment: any) => {
      await this.getAllPost(1)
    });

    this.socket.on('likePage', async (like: any) => {
      await this.getAllPost(1)
    });

    this.socket.on('deletePage', async (like: any) => {
      await this.getAllPost(1)
    });

    this.userId = await this.storage.get('userId');

  }

  async doRefresh(event: any) {
    await this.getAllPost(1);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
