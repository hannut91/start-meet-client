import {Injectable} from "@angular/core";

@Injectable()
export class StorageService {

  get user(): any {
    let user = localStorage.getItem('user');

    try {
      user = JSON.parse(user);
      return user;
    } catch (e) {
      return null;
    }
  };

  set user(_user) {
    if (_user)
      localStorage.setItem('user', JSON.stringify(_user));
    else
      localStorage.removeItem('user');
  };

  get token(): any {
    let token = localStorage.getItem('token');

    try {
      token = JSON.parse(token);
      return token;
    } catch (e) {
      return null;
    }
  };

  set token(_token: any) {
    if (_token)
      localStorage.setItem('token', JSON.stringify(_token));
    else
      localStorage.removeItem('token');
  };

  constructor() {
  }
}