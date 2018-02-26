import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MdButtonModule, MdDialogModule, MdInputModule} from "@angular/material";
import {FaceDetectRouting} from "./face-detect.routing";
import {FaceDetectComponent} from "./face-detect.component";
import {FaceSelectComponent} from "./face-select/face-select.component";
import {FaceSelectModule} from "./face-select/face-select.module";

@NgModule({
  declarations: [
    FaceDetectComponent,
  ],
  imports: [
    FaceDetectRouting,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MdInputModule,
    MdButtonModule,
    MdDialogModule,
    FaceSelectModule
  ],
  providers: [],
  entryComponents: [
    FaceSelectComponent
  ]
})
export class FaceDetectModule { }
