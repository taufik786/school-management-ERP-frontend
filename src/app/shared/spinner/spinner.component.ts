import { Component, OnInit } from '@angular/core';
import { CommonServices } from 'src/app/services/common.service';

@Component({
  selector: 'app-spinner',
  template: `<ion-loading
    isOpen="{{ spinnerOpen }}"
    message="Please wait..."
    spinner="circles"
  ></ion-loading>`,
})
export class SpinnerComponent implements OnInit {
  spinnerOpen: any = false;
  constructor(private commonServices: CommonServices) {}
  ngOnInit(): void {
    this.commonServices.isloader.subscribe((res) => {
      this.spinnerOpen = res;
    });
  }
}
