import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { StudentServices } from '../services/student.service';
import { Subscription } from 'rxjs';
import { CommonServices } from '../services/common.service';
import { ModalController } from '@ionic/angular';
import { StudentFormComponent } from './student-form/student-form.component';

@Component({
  selector: 'app-admission-management',
  templateUrl: './admission-management.component.html',
  styleUrls: ['./admission-management.component.scss'],
})
export class AdmissionManagementComponent implements OnInit, AfterViewInit {
  initialData: any = {
    formOpen: false,
    formData: null,
    formAction: 'Add',
  };
  snackObj: any = {
    formOpen: false,
    message: '',
    alertType: '',
  };
  getSchoolListSubscription: Subscription | any;

  displayedColumns: string[] = [
    'Action',
    'FirstName',
    'MiddleName',
    'LastName',
    'Email',
    'PhoneNumber',
    'Gender',
    'Date_of_birth',
    'Religion',
    'Category',
    'Caste',
    'BloodGroup',
    'CurrentAddress',
    'PermanentAddress',
    'AdmissionDate',
    'Session',
    'Class',
    'Section',
    'AdmissionNumber',
    'RollNumber',
    'Photo',
    'FatherName',
    'FatherPhoneNumber',
    'FatherOccupation',
    'MotherName',
    'MotherOccupation',
    'MotherPhoneNumber',
    'Username',
    'PreviousSchool',
    'Remarks',
    'IsActive',
    'createdAt',
    'updatedAt',
  ];
  dataSource: any = new MatTableDataSource([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentServices: StudentServices,
    private commonServices: CommonServices,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.dataSource= new MatTableDataSource([]);
    this.getSchoolList();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openForm(formStatus: any) {
    this.initialData = {
      formOpen: formStatus,
      formData: null,
      formAction: 'Add',
    };
  }

  getSchoolList = async () => {
    this.commonServices.preloaderOpen(true);
    this.getSchoolListSubscription = this.studentServices
      .allSchoolLists()
      .subscribe({
        next: (res: any) => {
          this.dataSource.data = res.data;
          this.commonServices.preloaderOpen(false);
          let snackObj = {
            formOpen: true,
            message: res.message,
            alertType: 'success',
          };
          this.commonServices.snackbarAlert(snackObj);
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
  };

  editRecord(rowData: any) {
    this.initialData = {
      formOpen: true,
      formData: rowData,
      formAction: 'Update',
    };
  }

  openDeleteDialog(rowData: any) {}

  receiveSavedData(data:any){
    // console.log(this.dataSource,"this.dataSource")
    // if(data.formAction === "Add"){
    //   console.log(data,"xxxx")
    //   let oldData = this.dataSource.filteredData;
    //   console.log(oldData,"xxxx")
    //   this.dataSource = oldData.unshift(data.formData);
    //   // this.dataSource.data.unshift(data.formData);

    // } else {
    //   let newData = this.dataSource.filteredData.map((item:any) => {
    //     if(item._id === data.formData._id){
    //       return data.formData;
    //     }
    //     return item
    // });
    // this.dataSource = newData;
    // }
  }
}
