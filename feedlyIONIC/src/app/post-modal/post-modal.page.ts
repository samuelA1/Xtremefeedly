import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import * as io from 'socket.io-client';
import { PostService } from '../_services/post.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-post-modal',
  templateUrl: './post-modal.page.html',
  styleUrls: ['./post-modal.page.scss'],
})
export class PostModalPage implements OnInit {
  post: any = {};
  isDisabled: boolean = true;
  socket: any;
  image: any;

  constructor(private modalCtrl: ModalController,
      private alertCtrl: AlertController,
      private postService: PostService,
      private camera: Camera) { 
    this.socket = io('http://localhost:3000');    
  }

  async addPost() {
    try {
      const postInfo = await this.postService.addPost(this.post);
      if (postInfo['success']) {
        this.socket.emit('refresh', this.post);
        this.modalCtrl.dismiss();
      } else {
        await this.presentAlert('Sorry, an error occured while trying to add a post');
      }
    } catch (error) {
      await this.presentAlert('Sorry, an error occured while trying to add a post');
    }
  }

  disableBtn() {
    this.isDisabled = false;
  }

  removeModal() {
    this.modalCtrl.dismiss();
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

  selectImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: false,
      correctOrientation: true,
      targetHeight: 300,
      targetWidth: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.image)
     }, (err) => {
       this.presentAlert(err);
     });
  }

  ngOnInit() {
  }

}
