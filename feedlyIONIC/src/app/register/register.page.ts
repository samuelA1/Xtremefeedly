import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
user: any = {};
  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  register() {
    this.validate(this.user);
  }

   validate(user: any) {
    if (user.username) {
      if (user.email) {
        if (user.password) {
          return true;
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

    await alert.present();
  }

}
