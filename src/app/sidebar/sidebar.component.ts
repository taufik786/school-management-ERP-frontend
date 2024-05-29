import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  panelOpenState = false;
  isLoader = false;
  isToaster = false;
  toastMessage: any;
  toastColor: string = 'primary';
  dismiss = [
    {
      text: 'Dismiss',
    },
  ];

  constructor(private commonService: CommonServices) {
  }

  ngOnInit(): void {
    this.initializeLoader();
    this.initializeToaster();
  }

  initializeLoader(): void {
    this.commonService.isloader.subscribe((flag: boolean) => {
      this.isLoader = flag;
    });
  }

  async initializeToaster() {
    this.commonService.toastMessage.subscribe(async (obj: any) => {
      this.isToaster = obj.isOpen;
      this.toastColor = obj.color;
      this.toastMessage = obj.message;

      await setTimeout(async () => {
        this.isToaster = false;
        this.toastColor = 'primary';
        this.toastMessage = '';
      }, 5000);
    });
  }

}
