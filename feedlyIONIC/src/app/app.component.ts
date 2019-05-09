import { PostService } from './_services/post.service';
import { UserService } from './_services/user.service';
import { AuthService } from './_services/auth.service';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';


import { Platform, NavController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PostModalPage } from './post-modal/post-modal.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  exp: any;
  unread: any = 'no';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    public authService: AuthService,
    private postService: PostService,
    private userService: UserService,
    private modalCtrl: ModalController,
  ) {
    this.initializeApp();
    this.getToken();
    this.postService.controlToTop$.subscribe((control) => {
      this.unread = control;
    })
  }

  async getToken() {
   this.authService.token = await this.storage.get('token');
    if (this.authService.token) {
       this.exp = await this.userService.getUserProfile();
       this.storage.set('userId', this.exp.decoded.user['_id']);
       if (this.exp['decoded']['exp'] < Date.now()) {
          this.navCtrl.navigateRoot('streams')
       } else {
        this.navCtrl.navigateRoot('login')
        this.storage.clear();
       }
    } else {
      this.navCtrl.navigateRoot('login')
    }
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
  scrollToTop() {
    this.postService.triggerToTop(true)
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
