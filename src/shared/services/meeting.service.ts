import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {StorageService} from "./storage.service";
import _ from 'lodash';

@Injectable()
export class MeetingService {

  serverUrl = environment.serverUrl + '/meeting';

  constructor(private http: HttpClient,
              private storageService: StorageService) {}

  find(queryParams: any): Observable<any> {
    let httpParams = new HttpParams();

    _.forEach(queryParams, (queryParam, prop) => {
      if (typeof queryParams[prop] === 'object') {
        httpParams = httpParams.append(prop, JSON.stringify(queryParam));
      } else {
        httpParams = httpParams.append(prop, queryParam);
      }
    });

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
      params: httpParams
    };

    return this.http
      .get(this.serverUrl, options);
  }

  findOne(queryParams: any): Observable<any> {
    let httpParams = new HttpParams();

    _.forEach(queryParams, (queryParam, prop) => {
      if (typeof queryParams[prop] === 'object') {
        httpParams = httpParams.append(prop, JSON.stringify(queryParam));
      } else {
        httpParams = httpParams.append(prop, queryParam);
      }
    });

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
      params: httpParams
    };

    return this.http
      .get(this.serverUrl + '/findOne', options);
  }

  create(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
    };

    return this.http
      .post(this.serverUrl, body, options);
  }

  update(body): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
    };

    return this.http
      .put(this.serverUrl, body, options);
  }

  remove(queryParams?: any): Observable<any> {
    let httpParams = new HttpParams();

    _.forEach(queryParams, (queryParam, prop) => {
      if (typeof queryParams[prop] === 'object') {
        httpParams = httpParams.append(prop, JSON.stringify(queryParam));
      } else {
        httpParams = httpParams.append(prop, queryParam);
      }
    });

    const options = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.storageService.token,
      }),
      params: httpParams
    };

    return this.http
      .delete(this.serverUrl, options);
  }
}

