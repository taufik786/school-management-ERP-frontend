import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolManagementRoutingModule } from './school-management-routing.module';
import { SchoolManagementComponent } from './school-management.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { SchoolServices } from '../services/school.service';


@NgModule({
  declarations: [SchoolManagementComponent],
  imports: [
    CommonModule,
    SchoolManagementRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [SchoolServices]
})
export class SchoolManagementModule { }
