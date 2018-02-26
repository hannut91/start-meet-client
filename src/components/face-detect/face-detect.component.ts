import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MeetingService} from "../../shared/services/meeting.service";
import {AppEventService} from "../../shared/services/app-event.service";
import {MdDialog, MdDialogConfig} from "@angular/material";
import * as moment from 'moment';
import {HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "../../shared/services/storage.service";
import {FaceSelectComponent} from "./face-select/face-select.component";
import _ from 'lodash';

declare const AWS;
declare const navigator;
declare const Buffer;

@Component({
  selector: 'face-detect',
  templateUrl: 'face-detect.component.html',
  styleUrls: ['face-detect.component.scss']
})
export class FaceDetectComponent implements OnInit {

  user = this.storageService.user;
  meeting = {
    name: '',
    startTime: ''
  };
  _id;
  localMediaStream;
  canvas;
  seatNumber = 0;
  @ViewChild('video') video: ElementRef;

  rekognition = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: 'AKIAIYL3MLWSOKUJHLLA',
    secretAccessKey: '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'
  });
  buffer;

  canSubmit = true;

  constructor(private activatedRoute: ActivatedRoute,
              private meetingService: MeetingService,
              private mdDialog: MdDialog,
              private appEventService: AppEventService,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.setEvents();
    this.init();
  }

  setEvents() {
    this.activatedRoute.queryParams
      .subscribe((queryParam: any) => {
        this._id = queryParam._id;

        this.findOneMeeting();
      });
  }

  init() {
    if (!this.hasGetUserMedia()) {
      return alert('지원하지 않는 브라우저입니다.');
    }

    this.canvas = document.querySelector('canvas');

    navigator.getUserMedia({video: true}, (stream) => {
      this.video.nativeElement.src = window.URL.createObjectURL(stream);
      this.localMediaStream = stream;
    }, (err) => {
      console.error(err);
    });
  }

  hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }

  findOneMeeting() {
    this.appEventService.loading.next(true);

    const params = {
      query: {
        _id: this._id
      },
      populate: [{
        path: 'meetingIssues'
      }]
    };
    this.meetingService.findOne(params)
      .finally(() => {
        this.appEventService.loading.next(false);
      })
      .subscribe((res: any) => {
        res.meeting.startTime = moment(res.meeting.startTime).format('LLLL')
        this.meeting = res.meeting;
        this.seatNumber = res.meeting.meetingIssues.length;
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
  }

  openFaceSelectForm() {
    if (!this.canSubmit) return;
    this.canSubmit = false;

    this.appEventService.loading.next(true);

    this.canvas.width = this.video.nativeElement.offsetWidth;
    this.canvas.height = this.video.nativeElement.offsetHeight;
    this.canvas.getContext('2d').drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);

    const blobData = this.canvas.toDataURL('image/jpeg');
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = blobData.match(regex);
    const ext = matches[1];
    const data = matches[2];
    this.buffer = new Buffer(data, 'base64');

    const params = {
      CollectionId: this.user.company,
      FaceMatchThreshold: 91,
      Image: {
        Bytes: this.buffer
      },
      MaxFaces: 5
    };
    return this.rekognition.detectFaces({
      Image: {
        Bytes: this.buffer
      },
    }).promise()
      .then((detectedFace) => {
        console.log("detectedFace ::: ", detectedFace);

        if (detectedFace.FaceDetails.length < 1) {
          throw new Error('There are no faces in the image. Should be at least 1.');
        }

        const validFaces = _.filter(detectedFace.FaceDetails, (face) => {
          return !this.isAllSide(face.Pose);
        });

        if (validFaces.length < 1) {
          throw new Error('There are no faces in the image. Should be at least 1.');
        }

        return this.rekognition.searchFacesByImage(params).promise();
      })
      .then((res) => {
        this.canSubmit = true;
        this.appEventService.loading.next(false);

        const dialogRef = this.mdDialog.open(FaceSelectComponent, <MdDialogConfig>{
          width: '960px',
          disableClose: true,
          data: {
            img: blobData,
            res: res,
            // faces: res
            meetingId: this._id
          }
        });
        dialogRef.afterClosed()
          .subscribe((result) => {
            this.findOneMeeting();
          });
      })

      .catch((err) => {
        this.canSubmit = true;
        console.error('err: ', err.message);
        if (err.message === 'There are no faces in the image. Should be at least 1.') {
          alert('얼굴을 인식할 수 없습니다.');
        }

        if (err.message === 'Side face') {
          alert('얼굴을 정면으로 인식해주세요.');
        }
        this.appEventService.loading.next(false);
      });
  }

  isAllSide(Pose: any) {
    for (const prop in Pose) {
      if (Pose[prop] < -15 || 15 < Pose[prop]) {
        return true;
      }
    }
  }

}
