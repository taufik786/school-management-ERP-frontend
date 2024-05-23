import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SchoolServices } from '../services/school.service';
import { Subscription } from 'rxjs';
import { AlertInput } from '@ionic/angular';

@Component({
  selector: 'app-school-management',
  templateUrl: './school-management.component.html',
  styleUrls: ['./school-management.component.scss'],
})
export class SchoolManagementComponent implements OnInit {

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: any = PageEvent;
  schoolListSubscription: Subscription | any;
  deleteSchoolSubscription: Subscription | any;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  displayedColumns: string[] = [
    'Action',
    'schoolName',
    'email',

  ];
  dataSource: any = new MatTableDataSource([]);

  formOpen = false;
  schoolLists: any = [];

  exitFormData = null;
  alertButtons: any = [];

  @ViewChild(MatSort) sort: any = MatSort;

  constructor(
    private schoolServices: SchoolServices,
    private _liveAnnouncer: LiveAnnouncer) {

  }

  ngOnInit() {
    this.dataSource = []; 
    this.schoolList();
    this.alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK',
        role: 'confirm'
      },
    ];
  }

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onItemSelect(item: any) {
  }
  onDeSelect(items: any) {
    // console.log(items,"onDeSelectAll");
  }
  onSelectAll(items: any) {
    // console.log(items,"all");
  }


  oepnForm(formStatus: any) {
    this.formOpen = formStatus;
  }

  schoolList() {
    this.schoolListSubscription = this.schoolServices.allSchoolLists().subscribe((res: any) => {
      console.log(res, "ttttttttt")
      this.schoolLists = res.data;
      this.dataSource = res.data;
    }, err => {
      console.log(err, "eeeeeeeeee")
    });
  }

  editRecord(rowData: any) {
    this.formOpen = true;
    this.exitFormData = rowData
    // console.log(rowData,"edit")
  }
  setResult(ev: any, rowData: any) {
    console.log(`Dismissed with role: ${ev.detail.role}`, ev, rowData);
  }

  async deleteRecord(buttonEvent: any, data: any) {
    console.log(data);
    if (buttonEvent.detail.role === 'confirm') {

      this.deleteSchoolSubscription = await this.schoolServices.deleteSchool(data._id).subscribe((res: any) => {
        console.log(res);
        this.schoolLists = this.schoolLists.map((scl: any) => {
          if (scl._id !== res.data._id) {
            return scl;
          }
        });
        console.log('record after delete::', this.schoolList, this.dataSource)
        this.dataSource = this.dataSource.map((scl: any) => {
          if (scl._id !== res.data._id) {
            return scl;
          }
        });
      }, err => {
        console.log(err, "eeeeeeeeee")
      });
    } else {
      
    console.log(`Dismissed with role: ${buttonEvent.detail.role}`, buttonEvent, data);
    }
  }

  receiveData(data: any) {
    console.log('Data received in parent:', data);
    this.dataSource.push(data);
    this.schoolLists.push(data);
  }


  ngOnDestroy(): void {
    this.schoolListSubscription.unsubscribe();
    this.deleteSchoolSubscription.unsubscribe();
  }
}
