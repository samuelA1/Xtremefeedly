import { UserService } from './_services/user.service';
import { AuthService } from './_services/auth.service';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';


import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  exp: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    public authService: AuthService,
    private userService: UserService
  ) {
    this.initializeApp();
    this.getToken();
  }

  async getToken() {
   this.authService.token = await this.storage.get('token');
    if (this.authService.token) {
       this.exp = await this.userService.getUserProfile();
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

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
