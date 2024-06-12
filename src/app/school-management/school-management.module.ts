import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolManagementRoutingModule } from './school-management-routing.module';
import { SchoolManagementComponent } from './school-management.component';
import { HttpClientModule } from '@angular/common/http';
import { SchoolServices } from '../services/school.service';
import { MaterialModule } from '../material-module';
import { IonicModule } from '@ionic/angular';
import { SchoolManagementFormComponent } from './school-management-form/school-management-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [SchoolManagementComponent, SchoolManagementFormComponent], // , CommonPipe, FormValidationPipe
  imports: [
    CommonModule,
    SchoolManagementRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    IonicModule.forRoot()
  ],
  providers: [SchoolServices],
  // exports: [ CommonPipe, FormValidationPipe]
})
export class SchoolManagementModule { }
