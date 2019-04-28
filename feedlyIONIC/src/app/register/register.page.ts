import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
user: any = {};
  constructor(private alertCtrl: AlertController,
     private authService: AuthService,
     private navCtrl: NavController,
     private storage: Storage) { }

  ngOnInit() {
  }

  async register() {
    try {
      if (this.validate(this.user )) {
        const userInfo = await this.authService.register(this.user);
        if (userInfo['success']) {
          this.navCtrl.navigateForward('home');
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
      cssClass: 'alertTitle'
    });

    await alert.present();
  }

}
