import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {StorageService} from "./storage.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) {
  }

  canActivate() {
    if (this.storageService.user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}