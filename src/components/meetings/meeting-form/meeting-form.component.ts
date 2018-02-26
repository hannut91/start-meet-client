import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MdDialogRef} from "@angular/material/dialog";
import * as moment from 'moment';
import {AppEventService} from "../../../shared/services/app-event.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MeetingService} from "../../../shared/services/meeting.service";
import {MD_DIALOG_DATA} from "@angular/material";
import {FormType} from "../../../shared/enums/form-type.enum";

@Component({
  selector: 'meeting-form',
  templateUrl: 'meeting-form.component.html',
  styleUrls: ['meeting-form.component.scss']
})
export class MeetingFormComponent implements OnInit {

  meetingForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    startTime: new FormControl('', Validators.required)
  });
  formErrors = {
    'name': '',
    'startTime': '',
  };
  validationMessages = {
    'name': {
      'required': '미팅명을 입력해주세요.',
    },
    'startTime': {
      'required': '미팅시간을 입력해주세요.',
    }
  };
  canSubmit = true;
  type = <FormType>this.data.formType;
  formType = FormType;
  _id = this.data._id;
  title = '';

  constructor(public mdDialogRef: MdDialogRef<MeetingFormComponent>,
              private appEventService: AppEventService,
              private meetingService: MeetingService,
              @Inject(MD_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.initForm();
    this.initData();
  }

  initForm() {
    this.meetingForm.statusChanges
      .subscribe(data => this.onStatusChanges(data));
  }

  onStatusChanges(data?: any) {
    if (!this.meetingForm) {
      return;
    }
    const form = this.meetingForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
          break;
        }
      }
    }
  }

  initData() {
    switch (this.type) {
      case FormType.Create:
        this.title = '만들기';
        break;
      case FormType.Update:
        this.appEventService.loading.next(true);
        this.title = '수정하기';
        const params = {
          query: {
            _id: this._id
          }
        };
        this.meetingService.findOne(params)
          .finally(() => {
            this.appEventService.loading.next(false);
          })
          .subscribe((res: any) => {
            this.meetingForm.get('name').setValue(res.meeting.name)
            this.meetingForm.get('startTime').setValue(moment(res.meeting.startTime).format('YYYY-MM-DDThh:mm'));
          }, (err) => {
            console.error('Meeting findOne err: ', err);

            if (!(err instanceof HttpErrorResponse)) {
              return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
            }

            switch (JSON.parse(err.error).message) {
              default:
                return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
            }
          });
        break;
      default:
        console.assert(false, '잘못된 type입니다. Create, Update중에 하나여야 합니다.');
    }
  }

  submit() {
    if (!this.canSubmit) return;
    this.canSubmit = false;

    this.appEventService.loading.next(true);

    const params = {
      name: this.meetingForm.get('name').value,
      startTime: moment(this.meetingForm.get('startTime').value).toDate()
    };
    this.meetingService.create(params)
      .finally(() => {
        this.appEventService.loading.next(false);
        this.canSubmit = true;
      })
      .subscribe((res: any) => {
        this.mdDialogRef.close(true);
      }, (err) => {
        console.error('meeting create err: ', err);

        if (!(err instanceof HttpErrorResponse)) {
          return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }

        switch (JSON.parse(err.error).message) {
          default:
            return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      });
  }

  update() {
    if (!this.canSubmit) return;
    this.canSubmit = false;

    this.appEventService.loading.next(true);

    const params = {
      query: {
        _id: this._id
      },
      name: this.meetingForm.get('name').value,
      startTime: moment(this.meetingForm.get('startTime').value).toDate()
    };
    this.meetingService.update(params)
      .finally(() => {
        this.appEventService.loading.next(false);
        this.canSubmit = true;
      })
      .subscribe((res: any) => {
        alert('수정되었습니다.');
        this.mdDialogRef.close(true);
      }, (err) => {
        console.error('meeting create err: ', err);

        if (!(err instanceof HttpErrorResponse)) {
          return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }

        switch (JSON.parse(err.error).message) {
          default:
            return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
        }
      });
  }
}
