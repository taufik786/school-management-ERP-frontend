import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/common.service';
import { AuthService } from '../auth/auth.service';

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
      text: 'X',
    },
  ];
  logedInStatus = false;
  loggedInUser: any;

  constructor(
    private commonService: CommonServices,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.logedInStatus = this.authService.getIsAuth();
    this.initializeLoader();
    this.initializeToaster();

    this.authService.loggedInUser.subscribe((res) => {
      this.loggedInUser = res;
    });
  }

  initializeLoader(): void {
    this.commonService.isloader.subscribe((flag: boolean) => {
      this.isLoader = flag;
    });
  }

  async initializeToaster(): Promise<void> {
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

  onLogout(): void {
    // this.commonService.updateLoader(true);
    // setTimeout(() => {
      // this.commonService.updateLoader(false);
      this.authService.logout();
    // }, 500);
  }
}
