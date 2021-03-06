import { AuthService } from '../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
user: any = {};
loading: any;
fabElement: any;
  constructor(private alertCtrl: AlertController,
     private authService: AuthService,
     private navCtrl: NavController,
     private storage: Storage, 
     private loadingCtrl: LoadingController) { 
      this.fabElement = document.querySelector('.post-fab');
     }

  ngOnInit() {
    if (this.fabElement) {
      (this.fabElement as HTMLElement).style.display = 'none'
    } else {
      (this.fabElement as HTMLElement).style.display = 'flex'
    }
  }

  async register() {
    await this.presentLoading();
    try {
      if (this.validate(this.user )) {
        const userInfo = await this.authService.register(this.user);
        if (userInfo['success']) {
          this.loading.dismiss();
          this.navCtrl.navigateForward('streams');
          this.storage.set('token', userInfo['token']);
        } else {
          this.loading.dismiss();
          await this.presentAlert(userInfo['message']);
          
        }
      }    
    } catch (error) {
      this.loading.dismiss();
      await this.presentAlert(error);
    }
  }

   validate(user: any) {
    if (user.username) {
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
    } else {
      this.presentAlert('Please enter your username');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Sign Up Error',
      message: `${message}`,
      buttons: ['OK'],
      cssClass: 'alertCss'
    });

    return await alert.present();
  }

  navigateBack() {
    this.navCtrl.navigateRoot('login');
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Authenticating..',
    });
    return await this.loading.present();
  }

}
