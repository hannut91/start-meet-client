import { NgModule } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_LOCALE, MdButtonModule, MdCardModule, MdDatepickerModule, MdDialogModule,
  MdInputModule, NativeDateAdapter, MD_DATE_FORMATS
} from "@angular/material";
import {CommonModule} from "@angular/common";
import {MeetingFormComponent} from "./meeting-form.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    MeetingFormComponent,
  ],
  imports: [
    MdCardModule,
    CommonModule,
    MdButtonModule,
    MdInputModule,
    MdDialogModule,
    MdDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    MeetingFormComponent
  ],
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_LOCALE, useValue: 'ko'},
    {provide: MD_DATE_FORMATS, useValue: MD_DATE_FORMATS},
  ],
})
export class MeetingFormModule {

}
