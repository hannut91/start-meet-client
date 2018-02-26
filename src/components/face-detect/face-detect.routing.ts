import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FaceDetectComponent} from "./face-detect.component";

export const routes: Routes = [
  {path: '', component: FaceDetectComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaceDetectRouting {
}