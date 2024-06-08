import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentServices } from '../services/student.service';
import { Subscription } from 'rxjs';
import { CommonServices } from '../services/common.service';

@Component({
  selector: 'app-admission-management',
  templateUrl: './admission-management.component.html',
  styleUrls: ['./admission-management.component.scss'],
})
export class AdmissionManagementComponent implements OnInit {

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: any = PageEvent;
  getSchoolListSubscription: Subscription | any;
  deleteSchoolSubscription: Subscription | any;
  selectedRecord: any;
  selectedDeletedRecord: any;
  isDeleteOpen: boolean = false;
  message: string = '';
  formAction = 'Add';
  toastObj: any;
  alertHeader: string = '';

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
    "Action",
    "FirstName",
    "MiddleName",
    "LastName",
    "Email",
    "PhoneNumber",
    "Gender",
    "Date_of_birth",
    "Religion",
    "Category",
    "Caste",
    "BloodGroup",
    "CurrentAddress",
    "PermanentAddress",
    "AdmissionDate",
    "Session",
    "Class",
    "Section",
    "AdmissionNumber",
    "RollNumber",
    "Photo",
    "FatherName",
    "FatherPhoneNumber",
    "FatherOccupation",
    "MotherName",
    "MotherOccupation",
    "MotherPhoneNumber",
    "Username",
    "PreviousSchool",
    "Remarks",
    "IsActive",
    "createdAt",
    "updatedAt"
  ];
  dataSource: any = new MatTableDataSource([]);

  formOpen = false;
  alertButtons: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private studentServices: StudentServices, private commonServices: CommonServices) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.getSchoolList();
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
    this.commonServices.updateLoader(false);
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

  getSchoolList = async () => {
    this.toastObj = {
      isOpen: false,
      message: "",
      color: 'primary'
    };
    if (this.toastObj) {
      this.getSchoolListSubscription = await this.studentServices.allSchoolLists().subscribe(async (res: any) => {
        this.dataSource.data = res.data.reverse();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.toastObj.isOpen = true;
        this.toastObj.color = 'success';
        this.toastObj.message = res.message;
        await this.commonServices.updateToastMessage(this.toastObj);
        await this.commonServices.updateLoader(false);
      }, err => {
        this.dataSource.data = [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.toastObj.isOpen = true;
        this.toastObj.color = 'danger';
        this.toastObj.message = 'Unable to process at this moment try after sometime.';
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
      });
    }
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
    this.alertHeader = `${rowData.FirstName}'s Data`;
    this.message = `Are you sure to delete record ? `;
  }

  deleteRecord(buttonEvent: any) {
    this.toastObj = {
      isOpen: false,
      message: "",
      color: 'primary'
    };
    if (buttonEvent.detail.role === 'confirm') {
      this.commonServices.updateLoader(true);
      this.deleteSchoolSubscription = this.studentServices.deleteSchool(this.selectedDeletedRecord._id).subscribe((res: any) => {
        this.isDeleteOpen = false;
        let newData = this.dataSource.data.filter((scl: any) => scl._id !== res.data._id);
        this.dataSource.data = newData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.toastObj.isOpen = true;
        this.toastObj.color = 'success';
        this.toastObj.message = res.message;
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
      }, err => {
        this.isDeleteOpen = false;
        this.toastObj.isOpen = true;
        this.toastObj.color = 'danger';
        this.toastObj.message = ' unable to delete record.';
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
      });
    } else {
      this.isDeleteOpen = false;
      this.commonServices.updateLoader(false);
    }
  }

  receiveData(data: any) {
    if (data !== null) {
      this.commonServices.updateLoader(true);
      if (this.formAction === 'Add') {
        // if (this.dataSource.data.length === 0) {
        //   Object.keys(data.formData).forEach((value: any) => {
        //     if (!(value == '_id' || value == 'Deleted' || value == '__v')) {
        //       this.displayedColumns.push(value);
        //     }
        //   });
        // }
        this.dataSource.data.unshift(data.formData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.formOpen = false;
        this.commonServices.updateLoader(false);
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
        this.commonServices.updateLoader(false);
      }
    } else {
      this.commonServices.updateLoader(false);
      this.formOpen = false;
    }
  }

  capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  applyFilter(event: any) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    if (this.getSchoolListSubscription) {
      this.getSchoolListSubscription.unsubscribe();
    }
    if (this.deleteSchoolSubscription) {
      this.deleteSchoolSubscription.unsubscribe();
    }
    this.commonServices.updateLoader(false);
  }
}
