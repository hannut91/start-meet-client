import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuardService} from "../shared/services/auth-guard.service";

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    loadChildren: '../components/meetings/meetings.module#MeetingsModule'
  },
  {
    path: 'face-detect',
    canActivate: [AuthGuardService],
    loadChildren: '../components/face-detect/face-detect.module#FaceDetectModule'
  },
  {path: 'login', loadChildren: '../components/login/login.component.module#LoginComponentModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRouting {
}
