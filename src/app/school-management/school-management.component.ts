import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SchoolServices } from '../services/school.service';
import { Subscription } from 'rxjs';
import { CommonServices } from '../services/common.service';

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
  selectedRecord: any;
  selectedDeletedRecord: any;
  isDeleteOpen: boolean = false;
  message: string = '';
  formAction = 'Add';

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
    'phone',
    'email',
    'schoolType',
    'directorName',
    'established',
    'createdAt',
    'updatedAt'
  ];
  dataSource: any = new MatTableDataSource([]);

  formOpen = false;
  alertButtons: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private schoolServices: SchoolServices, private commonServices: CommonServices) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openForm(formStatus: any) {
    this.formOpen = formStatus;
    this.formAction = 'Add';
    this.selectedRecord = {
      formOpen: formStatus,
      formData: null,
      formAction: 'Add'
    };
  }

  schoolList = async () => {
    this.commonServices.updateLoader();
    this.schoolListSubscription = await this.schoolServices.allSchoolLists().subscribe((res: any) => {
      console.log(res, "ttttttttt")
      this.dataSource.data = res.data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.commonServices.updateLoader();
    }, err => {
      console.log(err, "eeeeeeeeee");
    });
  }

  editRecord(rowData: any) {
    this.formOpen = true;
    this.formAction = 'Update';
    this.selectedRecord = {
      formOpen: true,
      formData: rowData,
      formAction: 'Update'
    };
  }

  openDeleteDialog(rowData: any) {
    this.isDeleteOpen = true;
    this.selectedDeletedRecord = rowData;
    this.message = `Are you sure to delete record ${rowData.schoolName} ? `;
  }

  deleteRecord(buttonEvent: any) {
    if (buttonEvent.detail.role === 'confirm') {
      this.commonServices.updateLoader();
      this.deleteSchoolSubscription = this.schoolServices.deleteSchool(this.selectedDeletedRecord._id).subscribe((res: any) => {
        this.isDeleteOpen = false;
        let newData = this.dataSource.data.filter((scl: any) => scl._id !== res.data._id);
        this.dataSource.data = newData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.commonServices.updateLoader();
      }, err => {
        this.isDeleteOpen = false;
        this.commonServices.updateLoader();
      });
    } else {
      this.isDeleteOpen = false;
      this.commonServices.updateLoader();
    }
  }

  receiveData(data: any) {
    if (data !== null) {
      if (this.formAction === 'Add') {
        this.dataSource.data.push(data.formData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.formOpen = false;
      } else {
        let newData = this.dataSource.data.map((element: any) => {
          if (element._id === data.formData._id) {
            element = data.formData;
            return element;
          }
          return element;
        });
        this.dataSource.data = newData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.formOpen = false;
      }
    } else {
      this.formOpen = false;
    }
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  ngOnDestroy(): void {
    if (this.schoolListSubscription) {
      this.schoolListSubscription.unsubscribe();
    }
    if (this.deleteSchoolSubscription) {
      this.deleteSchoolSubscription.unsubscribe();
    }
  }
}
