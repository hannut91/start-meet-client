import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FaceSelectComponent} from "./face-select.component";
import {MdButtonModule, MdDialogModule} from "@angular/material";

@NgModule({
  declarations: [
    FaceSelectComponent
  ],
  imports: [
    MdDialogModule,
    MdButtonModule,
    CommonModule
  ],
  providers: [
  ]
})
export class FaceSelectModule {

}
