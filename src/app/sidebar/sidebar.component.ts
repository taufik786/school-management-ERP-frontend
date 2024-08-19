import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/common.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  isToaster = false;
  alertInfo: any;
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
    private authService: AuthService,
    private router: Router,
    private menuCntrl: MenuController,
    private navCntrl: NavController
  ) {}

  ngOnInit(): void {
    this.logedInStatus = this.authService.getIsAuth();
    this.authService.loggedInUser.subscribe((res) => {
      this.loggedInUser = res;
    });
  }

  openItems(path: string) {
    this.navCntrl.setDirection('root');
    this.router.navigateByUrl(path);
    this.menuCntrl.toggle();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
