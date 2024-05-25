import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionManagementRoutingModule } from './admission-management-routing.module';
import { AdmissionManagementComponent } from './admission-management.component';
import { StudentsDetailsComponent } from './students-details/students-details.component';
import { AdmissionFormsComponent } from './admission-forms/admission-forms.component';


@NgModule({
  declarations: [AdmissionManagementComponent, StudentsDetailsComponent, AdmissionFormsComponent],
  imports: [
    CommonModule,
    AdmissionManagementRoutingModule
  ]
})
export class AdmissionManagementModule { }
