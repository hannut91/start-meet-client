import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MeetingsComponent} from "./meetings.component";

export const routes: Routes = [
  {path: '', component: MeetingsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingsRouting {
}