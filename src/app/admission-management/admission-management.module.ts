import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdmissionManagementRoutingModule } from './admission-management-routing.module';
import { AdmissionManagementComponent } from './admission-management.component';
import { AdmissionFormsComponent } from './admission-forms/admission-forms.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialModule } from '../material-module';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentServices } from '../services/student.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AdmissionManagementComponent, AdmissionFormsComponent, StudentFormComponent], 
  // StudentsDetailsComponent
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionManagementRoutingModule,
    CommonModule,
    SharedModule,
    IonicModule.forRoot(),
  ],
  providers:[StudentServices]
})
export class AdmissionManagementModule { }
