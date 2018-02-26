import {Component, OnInit} from '@angular/core';
import {AppEventService} from "../shared/services/app-event.service";
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading = false;

  constructor(private appEventService: AppEventService) {
  }

  ngOnInit() {
    this.setEvents();
    moment.locale('ko');

  }

  setEvents() {
    this.appEventService.loading
      .subscribe((_loading: boolean) => {
        setTimeout(() => {
          this.loading = _loading;
        }, 0);
      });
  }
}

