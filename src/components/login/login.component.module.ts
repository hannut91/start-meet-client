import { NgModule } from '@angular/core';
import {LoginComponent} from "./login.component";
import {LoginRouting} from "./login.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MdButtonModule, MdInputModule} from "@angular/material";

@NgModule({
  declarations: [
    LoginComponent,

  ],
  imports: [
    LoginRouting,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MdInputModule,
    MdButtonModule
  ],
  providers: [],
})
export class LoginComponentModule { }
