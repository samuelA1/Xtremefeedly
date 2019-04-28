import { Storage } from '@ionic/storage';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = {};

  constructor(private navCtrl: NavController,
     private authService: AuthService, 
     private storage: Storage, 
     private alertCtrl: AlertController) { }

     async login() {
      try {
        if (this.validate(this.user )) {
          const userInfo = await this.authService.login(this.user);
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
        header: 'Sign Up Error',
        message: `${message}`,
        buttons: ['OK'],
        cssClass: 'alertTitle'
      });
  
      await alert.present();
    }

  ngOnInit() {
  }

  registerPage() {
    this.navCtrl.navigateForward('/register')
  }

}
