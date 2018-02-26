import {Component, OnInit, Inject, ElementRef, ViewChild} from '@angular/core';
import {MdDialogRef} from "@angular/material/dialog";
import {MD_DIALOG_DATA} from "@angular/material";
import {AppEventService} from "../../../shared/services/app-event.service";
import {StorageService} from "../../../shared/services/storage.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MeetingIssueService} from "../../../shared/services/meeting-issue.service";
import {MeetingService} from "../../../shared/services/meeting.service";

declare const AWS;
declare const Buffer;

@Component({
  selector: 'face-select.component',
  templateUrl: 'face-select.component.html',
  styleUrls: ['face-select.component.scss']
})
export class FaceSelectComponent implements OnInit {

  @ViewChild('faceRef') faceRef: ElementRef;
  @ViewChild('faceImgRef') faceImgRef: ElementRef;
  img = this.data.img;
  res = this.data.res;
  face = this.res.SearchedFaceBoundingBox;
  meetingId = this.data.meetingId;
  urlRegex = /^data:.+\/(.+);base64,(.*)$/;
  canSubmit = true;
  user = this.storageService.user;
  buffer;
  rekognition = new AWS.Rekognition({
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: ''
  });

  constructor(public mdDialogRef: MdDialogRef<FaceSelectComponent>,
              private appEventService: AppEventService,
              @Inject(MD_DIALOG_DATA) public data: any,
              private storageService: StorageService,
              private meetingService: MeetingService,
              private meetingIssueService: MeetingIssueService) {
  }

  ngOnInit() {
    this.findFace();
  }

  findFace() {
    const regex = /^data:.+\/(.+);base64,(.*)$/;

    const matches = this.img.match(regex);
    const ext = matches[1];
    const data = matches[2];
    this.buffer = new Buffer(data, 'base64');

    return Promise.resolve()
      .then(() => {
        if (this.res.FaceMatches && this.res.FaceMatches.length < 1) {
          const param = {
            CollectionId: this.user.company, /* required */
            Image: {
              Bytes: this.buffer
            },
            DetectionAttributes: [
              'DEFAULT'
            ]
          };
          return this.rekognition.indexFaces(param).promise()
            .then((_data: any) => {
              console.log("_data ::: ", _data);
              return _data.FaceRecords[0].Face.FaceId;
            });
        }

        return this.res.FaceMatches[0].Face.FaceId;
      })
      .then((faceId) => {
        const param = {
          faceId: faceId,
          meeting: this.meetingId
        };
        this.meetingIssueService.create(param)
          .finally(() => {
            this.appEventService.loading.next(false);
            this.canSubmit = true;
          })
          .flatMap(() => {
            const params = {
              query: {
                _id: this.meetingId
              },
              populate: [{
                path: 'meetingIssues'
              }]
            };
            return this.meetingService.findOne(params);
          })
          .subscribe((res: any) => {
            alert(res.meeting.meetingIssues.length + '번 좌석입니다.');
          }, (err) => {
            console.error('meetingIssueService create err: ', err);

            if (!(err instanceof HttpErrorResponse)) {
              return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
            }

            switch (err.status) {
              case 400:
                setTimeout(() => {
                  alert('이미 참여했습니다.');
                }, 100);
                break;
              default:
                return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
            }
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


  // selectFace(face: any) {
  //   if (!this.canSubmit) return;
  //   this.canSubmit = false;
  //
  //   this.appEventService.loading.next(true);
  //
  //   const width = this.faceImgRef.nativeElement.offsetWidth;
  //   const height = this.faceImgRef.nativeElement.offsetHeight;
  //   this.faceRef.nativeElement.width = face.BoundingBox.Width * width + 200;
  //   this.faceRef.nativeElement.height = face.BoundingBox.Height * height + 200;
  //   this.faceRef.nativeElement.getContext('2d').drawImage(
  //     this.faceImgRef.nativeElement,
  //     face.BoundingBox.Left * width - 100,
  //     face.BoundingBox.Top * height - 100,
  //     face.BoundingBox.Width * width + 200,
  //     face.BoundingBox.Height * height + 200,
  //     0,
  //     0,
  //     face.BoundingBox.Width * width + 200,
  //     face.BoundingBox.Height * height + 200
  //   );
  //
  //   const faceData = this.faceRef.nativeElement.toDataURL('image/jpeg');
  //
  //   const matches = faceData.match(this.urlRegex);
  //   const buffer = new Buffer(matches[2], 'base64');
  //
  //   const params = {
  //     CollectionId: this.user.company,
  //     FaceMatchThreshold: 91,
  //     Image: {
  //       Bytes: buffer
  //     },
  //     MaxFaces: 5
  //   };
  //
  //   return this.rekognition.searchFacesByImage(params).promise()
  //     .then((res) => {
  //       console.log("res ::: ", res);
  //       if (res.FaceMatches && res.FaceMatches.length < 1) {
  //         const param = {
  //           CollectionId: this.user.company, /* required */
  //           Image: {
  //             Bytes: buffer
  //           },
  //           DetectionAttributes: [
  //             'DEFAULT'
  //           ]
  //         };
  //         return this.rekognition.indexFaces(param).promise()
  //           .then((_data: any) => {
  //             console.log("_data ::: ", _data);
  //             return _data.FaceRecords[0].Face.FaceId;
  //           });
  //       }
  //
  //       return res.FaceMatches[0].Face.FaceId;
  //     })
  //     .then((faceId) => {
  //       const param = {
  //         faceId: faceId,
  //         meeting: this.meetingId
  //       };
  //       this.meetingIssueService.create(param)
  //         .finally(() => {
  //           this.appEventService.loading.next(false);
  //           this.canSubmit = true;
  //         })
  //         .flatMap(() => {
  //           const params = {
  //             query: {
  //               _id: this.meetingId
  //             },
  //             populate: [{
  //               path: 'meetingIssues'
  //             }]
  //           };
  //           return this.meetingService.findOne(params)
  //         })
  //         .subscribe((res: any) => {
  //           alert(res.meeting.meetingIssues.length + '번 좌석입니다.');
  //           face.checked = true;
  //         }, (err) => {
  //           console.error('meetingIssueService create err: ', err);
  //
  //           if (!(err instanceof HttpErrorResponse)) {
  //             return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
  //           }
  //
  //           switch (err.status) {
  //             case 400:
  //               alert('이미 참여했습니다.');
  //               break;
  //             default:
  //               return alert('의도치 않은 오류가 발생했습니다. 관리자에게 문의해주세요.');
  //           }
  //         });
  //     })
  //     .catch((err) => {
  //       this.canSubmit = true;
  //       console.error('err: ', err.message);
  //       if (err.message === 'There are no faces in the image. Should be at least 1.') {
  //         alert('얼굴을 인식할 수 없습니다.');
  //       }
  //
  //       if (err.message === 'Side face') {
  //         alert('얼굴을 정면으로 인식해주세요.');
  //       }
  //       this.appEventService.loading.next(false);
  //     });
  // }
}
