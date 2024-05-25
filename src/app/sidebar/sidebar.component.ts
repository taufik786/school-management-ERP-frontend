import { Component, OnInit } from '@angular/core';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent{

  panelOpenState = false;
  isLoader = false;
  constructor(private commonService: CommonServices) {
    this.commonService.isloader.subscribe((flag: boolean) =>{
      this.isLoader = flag;
    });
   }

  // ngOnInit() {}

}
