import { UserService } from './../_services/user.service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = {};
  tabElement: any;
  fabElement: any;

  constructor(private navCtrl: NavController,
     private authService: AuthService,
     private userService: UserService, 
     private storage: Storage, 
     private alertCtrl: AlertController,
     private loadingCtrl: LoadingController) { 
       this.tabElement = document.querySelector('.tabar');
       this.fabElement = document.querySelector('.post-fab');
     }

     async login() {
      await this.presentLoading();
      try {
        if (this.validate(this.user )) {
          const userInfo = await this.authService.login(this.user);
          if (userInfo['success']) {
            const exp = await this.userService.getUserProfile();
            this.storage.set('userId', exp['decoded'].user['_id']);
            this.navCtrl.navigateForward('streams');
            this.storage.set('token', userInfo['token']);
          } else {
            await this.presentAlert(userInfo['message']);
          }
        }    
      } catch (error) {
        await this.presentAlert(error);
      }
    }
  
     validate(user: any) {
        if (user.email) {
          if (user.password) {
            if (user.email.includes('@')) {
              if (user.password.length >=4 && user.password.length <= 11) {
                return true;
              } else {
                this.presentAlert('Your password must not be less than 4 and must not be greater than 11 characters ')
              }
            } else {
              this.presentAlert('Please enter a valid email');
            }
          } else {
            this.presentAlert('Please enter your password');
          }
        } else {
          this.presentAlert('Please enter your email');
        }
    }
  
    async presentAlert(message: string) {
      const alert = await this.alertCtrl.create({
        header: 'Login Error',
        message: `${message}`,
        buttons: ['OK'],
        cssClass: 'alertTitle'
      });
  
      await alert.present();
    }

  ngOnInit() {
    if (this.tabElement) {
      (this.tabElement as HTMLElement).style.display = 'none'
    } else {
      (this.tabElement as HTMLElement).style.display = 'flex'
    }
    if (this.fabElement) {
      (this.fabElement as HTMLElement).style.display = 'none'
    } else {
      (this.fabElement as HTMLElement).style.display = 'flex'
    }
  }

  registerPage() {
    this.navCtrl.navigateForward('register')
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      duration: 1000,
      message: 'Authenticating..',
    });
    return await loading.present();
  }

}
