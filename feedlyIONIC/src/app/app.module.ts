import { CommentModalPageModule } from './comment-modal/comment-modal.module';
import { PostService } from './_services/post.service';
import { PostModalPageModule } from './post-modal/post-modal.module';
import { UserService } from './_services/user.service';
import { AuthService } from './_services/auth.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { RouteReuseStrategy } from '@angular/router';
import { Camera } from '@ionic-native/camera/ngx';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
     HttpClientModule, 
     IonicModule.forRoot(), 
     AppRoutingModule, 
     IonicStorageModule.forRoot(),
     PostModalPageModule,
     CommentModalPageModule
     ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    UserService,
    PostService,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
