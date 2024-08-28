import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
export class SchoolManagementComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  showFirstLastButtons = true;
  schoolListSubscription: Subscription | any;
  selectedRecord: any = {};
  formAction = 'Add';
  snackObj = {
    formOpen: false,
    message: '',
    alertType: '',
  };

  displayedColumns: string[] = [
    'Action',
    'SchoolName',
    'PhoneNumber',
    'Email',
    'Established',
    'Address',
    'SchoolType',
    'DirectorName',
    'createdAt',
    'updatedAt',
  ];
  dataSource: any = new MatTableDataSource([]);

  formOpen = false;
  alertButtons: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  changeWidth: boolean = false;

  constructor(
    private schoolServices: SchoolServices,
    private commonServices: CommonServices
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.schoolList();
    this.alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'OK',
        role: 'confirm',
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
      formAction: 'Add',
    };
    this.commonServices.snackbarAlert(
      ((this.snackObj.formOpen = false), this.snackObj)
    );
  }
  schoolList() {
    this.commonServices.preloaderOpen(true);

    this.schoolListSubscription = this.schoolServices.allSchoolLists().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data;
        this.snackObj = {
          formOpen: true,
          message: res.message,
          alertType: 'success',
        };
        this.commonServices.snackbarAlert(this.snackObj);
        this.commonServices.preloaderOpen(false);
      },
      error: (err) => {
        this.dataSource.data = [];
        this.snackObj = {
          formOpen: true,
          message: err.error.message,
          alertType: 'danger',
        };
        this.commonServices.snackbarAlert(this.snackObj);
        this.commonServices.preloaderOpen(false);
      },
    });
  }

  editRecord(rowData: any) {
    this.formOpen = true;
    this.formAction = 'Update';
    this.selectedRecord = {
      formOpen: true,
      formData: rowData,
      formAction: 'Update',
    };
  }

  openDeleteDialog(rowData: any) {
    rowData.isDeleteOpen = true;
    this.selectedRecord = rowData;
  }

  deleteRecord(buttonEvent: any) {
    if (buttonEvent.detail.role === 'confirm') {
      this.commonServices.preloaderOpen(true);
      this.schoolServices.deleteSchool(this.selectedRecord._id).subscribe({
        next: (res: any) => {
          this.selectedRecord.isDeleteOpen = false;
          let newData = this.dataSource.data.filter(
            (scl: any) => scl._id !== res.data._id
          );
          this.dataSource.data = newData;

          this.snackObj = {
            formOpen: true,
            alertType: 'success',
            message: res.message,
          };
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
        },
        error: (err) => {
          this.selectedRecord.isDeleteOpen = false;
          this.snackObj = {
            formOpen: true,
            alertType: 'danger',
            message: err.error.message,
          };
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
        },
      });
    } else {
      this.selectedRecord.isDeleteOpen = false;
      this.commonServices.preloaderOpen(false);
    }
  }

  private updateDataSource(data: any) {
    this.dataSource.data = [
      data.formData,
      ...this.dataSource.data.filter(
        (item: { _id: any }) => item._id !== data.formData._id
      ),
    ];
    this.formOpen = false;
    this.commonServices.preloaderOpen(false);
  }

  formOpenStatus(data: any) {
    this.formOpen = false;
    if (data === null) {
      this.commonServices.preloaderOpen(false);
      this.changeWidth = false;
      return;
    }

    this.commonServices.preloaderOpen(true);
    this.formAction === 'Add'
      ? this.updateDataSource(data)
      : this.updateDataSourceAfterEdit(data);
  }

  private updateDataSourceAfterEdit(data: any) {
    this.dataSource.data = this.dataSource.data.map((element: { _id: any }) => {
      return element._id === data.formData._id ? data.formData : element;
    });
    this.commonServices.preloaderOpen(false);
  }

  /**
   * Capitalizes the first letter of each word in the given string, except for
   * the specified special keys.
   *
   * @param {string} key - The string to capitalize.
   * @return {string} The capitalized string.
   */
  capitalize(key: string): string {
    if (key === '__v' || key === '_id' || key === 'Deleted') {
      return key;
    }
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^[a-z]/, (match) => match.toUpperCase());
  }

  /**
   * Applies a filter to the data source based on the provided event value.
   *
   * @param {any} event - The event object that triggered the filter.
   * @return {void} This function does not return anything.
   */
  applyFilter(event: any) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    // if (this.schoolListSubscription) {
    this.schoolListSubscription.unsubscribe();
    // }
  }

  exportToExcel(): void {}
  fabButtonEvent() {
    // console.log('fabButtonEvent: ', this.fab?.activated);
    // if (!this.fab?.activated) {
    //   this.changeWidth = true;
    // } else {
    //   this.changeWidth = false;
    // }
    this.changeWidth = !this.changeWidth;
  }
  async generatePdf(element: any) {
    console.log(element, 'lllllllllll');
  }
}
