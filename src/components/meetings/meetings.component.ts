import {Component, OnInit} from '@angular/core';
import {MdDialog, MdDialogConfig} from "@angular/material";
import {MeetingFormComponent} from "./meeting-form/meeting-form.component";
import {FormType} from "../../shared/enums/form-type.enum";
import {AppEventService} from "../../shared/services/app-event.service";
import {MeetingService} from "../../shared/services/meeting.service";
import {HttpErrorResponse} from "@angular/common/http";
import _ from 'lodash';
import * as moment from 'moment';
import {Router} from "@angular/router";
import {StorageService} from "../../shared/services/storage.service";

@Component({
  selector: 'meetings',
  templateUrl: 'meetings.component.html',
  styleUrls: ['meetings.component.scss']
})
export class MeetingsComponent implements OnInit {

  meetings = [];
  more = false;
  total = 0;
  formType = FormType;

  constructor(private mdDialog: MdDialog,
              private appEventService: AppEventService,
              private meetingService: MeetingService,
              private router: Router,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.findMeeting();
  }

  findMeeting() {
    this.appEventService.loading.next(true);

    const params = {
      limit: 20,
      skip: this.meetings.length,
      populate: ['meetingIssues']
    };
    this.meetingService.find(params)
      .finally(() => {
        this.appEventService.loading.next(false);
      })
      .subscribe((res: any) => {
        _.forEach(res.meetings, (meeting) => {
          meeting.startTime = moment(meeting.startTime).format('LLLL');
        });
        this.meetings = this.meetings.concat(res.meetings);
        this.more = res.more;
        this.total = res.total;
      }, (err) => {
        console.error('login err: ', err);

        if (!(err instanceof HttpErrorResponse)) {
          return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }

        switch (JSON.parse(err.error).message) {
          case 'id or password is not matching':
            return alert('id 혹은 비밀번호가 틀렸습니다.');
          default:
            return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      });

  }

  openMeetingForm(formType, _id?) {
    const dialogRef = this.mdDialog.open(MeetingFormComponent, <MdDialogConfig>{
      width: '960px',
      data: {
        formType: formType,
        _id: _id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (typeof result === 'boolean') {
        this.meetings = [];
        this.findMeeting();
      }
    });
  }

  goToFaceDetect(_id: number) {
    this.router.navigate(['face-detect'], {
      queryParams: {
        _id: _id,
      }
    });
  }

  click2(e) {
    e.stopPropagation();
  }

  removeMeeting(_id: number) {
    if (!confirm('삭제하시겠습니까?')) return;

    this.appEventService.loading.next(true);

    const params = {
      query: {
        _id: _id
      }
    };
    this.meetingService.remove(params)
      .subscribe((res: any) => {
        this.meetings = [];
        this.findMeeting();
      }, (err) => {
        console.error('login err: ', err);

        if (!(err instanceof HttpErrorResponse)) {
          return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }

        switch (JSON.parse(err.error).message) {
          default:
            return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      });
  }

  logout() {
    this.storageService.user = null;
    this.storageService.token = null;
    this.router.navigate(['login']);
  }
}
