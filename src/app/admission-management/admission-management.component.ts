import { Component, ViewChild } from '@angular/core';
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
export class AdmissionManagementComponent {
  initialData: any = {
    formOpen: false,
    formData: null,
    formAction: 'Add',
  };

  openForm(formStatus: any) {
    this.initialData = {
      formOpen: formStatus,
      formData: null,
      formAction: 'Add',
    };
  }
}
