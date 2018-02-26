import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {AppEventService} from "../../shared/services/app-event.service";
import {StorageService} from "../../shared/services/storage.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  formErrors: any;
  validationMessages: any;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private appEventService: AppEventService,
              private storageService: StorageService) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formErrors = {
      'email': '',
      'password': '',
    };
    this.validationMessages = {
      'email': {
        'required': '이메일을 입력해주세요.',
        'minlength': '이메일은 최소 6 글자 이상입니다.',
        'pattern': '이메일 형식이 아닙니다.'
      },
      'password': {
        'required': '비밀번호를 입력해주세요.',
        'minlength': '비밀번호는 최소 6 글자 이상입니다.'
      }
    };

    this.email = new FormControl("", Validators.compose([
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ]));
    this.password = new FormControl("", Validators.compose([
      Validators.required,
      Validators.minLength(6),
    ]));

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });

    this.loginForm.statusChanges
      .subscribe(data => this.onStatusChanges(data));
    this.onStatusChanges();
  }

  onStatusChanges(data?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;

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

  login() {
    this.appEventService.loading.next(true);
    this.authService.login(this.email.value, this.password.value)
      .finally(() => {
        this.appEventService.loading.next(false);
      })
      .subscribe((res: any) => {
        if(res.user.role !== 'User') {
          return alert('권한이 없습니다.');
        }
        this.storageService.user = res.user;
        this.storageService.token = res.token;
        this.router.navigate(['']);
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
}
