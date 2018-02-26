import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {StorageService} from "../shared/services/storage.service";
import {AuthGuardService} from "../shared/services/auth-guard.service";
import {AppRouting} from "./app.routing";
import {AppEventService} from "../shared/services/app-event.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MeetingsModule} from "../components/meetings/meetings.module";
import {AuthService} from "../shared/services/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {MeetingService} from "../shared/services/meeting.service";
import {FaceDetectModule} from "../components/face-detect/face-detect.module";
import {MeetingIssueService} from "../shared/services/meeting-issue.service";
import {FaceSelectModule} from "../components/face-detect/face-select/face-select.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    BrowserAnimationsModule,
    HttpClientModule,
    // MeetingsModule,
    // FaceDetectModule,
    // FaceSelectModule
  ],
  providers: [
    StorageService,
    AuthGuardService,
    AppEventService,
    AuthService,
    MeetingService,
    MeetingIssueService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
