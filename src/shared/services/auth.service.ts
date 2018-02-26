import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthService {

  serverUrl = environment.serverUrl + '/auth';

  constructor(private http: HttpClient) {}

  login(identifier: string, password: string): Observable<any> {
    return this.http
      .post(this.serverUrl + '/login', {
        identifier: identifier,
        password: password
      });
  }
}

