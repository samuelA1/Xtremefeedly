import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'streams', loadChildren: './streams/streams.module#StreamsPageModule' },
  { path: 'post-modal', loadChildren: './post-modal/post-modal.module#PostModalPageModule' },
  { path: 'comment-modal', loadChildren: './comment-modal/comment-modal.module#CommentModalPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
