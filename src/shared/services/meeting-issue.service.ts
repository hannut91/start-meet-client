import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";

@Injectable()
export class MeetingIssueService {

  serverUrl = environment.serverUrl + '/meetingIssue';

  constructor(private http: HttpClient,
              private storageService: StorageService) {}

  create(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
    };

    return this.http
      .post(this.serverUrl, body, options);
  }
}

