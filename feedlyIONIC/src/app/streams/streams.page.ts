import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PostModalPage } from '../post-modal/post-modal.page';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.page.html',
  styleUrls: ['./streams.page.scss'],
})
export class StreamsPage implements OnInit {
  stream: any = {};

  constructor(private modalCtrl: ModalController) { 
    this.stream = "post"
  }
  segmentChanged(ev: any) {
    this.stream = `${ev.detail.value}`
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

  ngOnInit() {
  }

}
