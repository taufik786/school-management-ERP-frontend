import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-alert-popup',
  template: `
    <ion-alert
      isOpen="{{ isOpen }}"
      header="Alert!"
      message="Do you want to close this form?"
      [buttons]="alertButtons"
      (didDismiss)="closeForm($event)"
    ></ion-alert>
  `,
})
export class AlertPopUpComponent implements OnInit {
  isOpen = false;
  public alertButtons = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        // console.log('Alert canceled');
      },
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
      },
    },
  ];

  constructor(private commonServices: CommonServices) {}

  ngOnInit(): void {
    this.commonServices._popupAlertOpen.subscribe((res: any) => {
      this.isOpen = res;
    });
  }
  closeForm(ev: any) {
    if (ev.detail.role === 'confirm') {
      this.commonServices.popupAlert(false);
    } else {
      this.isOpen = false;
    }
  }
}
