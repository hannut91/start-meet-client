import { NgModule } from '@angular/core';
import {MeetingsComponent} from "./meetings.component";
import {MeetingsRouting} from "./meetings.routing";
import {MdButtonModule, MdCardModule, MdDialogModule, MdMenuModule} from "@angular/material";
import {CommonModule} from "@angular/common";
import {MeetingFormModule} from "./meeting-form/meeting-form.module";

@NgModule({
  declarations: [
    MeetingsComponent,
  ],
  imports: [
    MeetingsRouting,
    MdCardModule,
    CommonModule,
    MdButtonModule,
    MdDialogModule,
    MeetingFormModule,
    MdMenuModule
  ],
  providers: [],
})
export class MeetingsModule { }
