import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = {};

  constructor(private navCtrl: NavController, ) { }

  ngOnInit() {
  }

  registerPage() {
    this.navCtrl.navigateForward('/register')
  }

}
