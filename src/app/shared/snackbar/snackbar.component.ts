import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonServices } from 'src/app/services/common.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnacbarComponent implements OnInit {
  alert: any = {};
  private snackbarTimeout: any;
  constructor(private commonServices: CommonServices) {}

  ngOnInit(): void {
    this.commonServices.snackbarInfo.subscribe((res: any) => {
      if (Object.keys(res).length) {
        this.alert = { ...res };
        // console.log(res, 'alert info');
        this.showSnackbar();
      }
    });
  }

  showSnackbar() {
    this.snackbarTimeout = setTimeout(() => {
      this.closeSnackbar();
    }, 5000);
  }

  closeSnackbar() {
    this.alert.formOpen = false;
    clearTimeout(this.snackbarTimeout);
  }

  pauseTimer() {
    clearTimeout(this.snackbarTimeout);
  }

  resumeTimer() {
    this.snackbarTimeout = setTimeout(() => {
      this.closeSnackbar();
    }, 3000);
  }
}
