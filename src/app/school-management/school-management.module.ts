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


@NgModule({
  declarations: [SchoolManagementComponent, SchoolManagementFormComponent],
  imports: [
    CommonModule,
    SchoolManagementRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot()
  ],
  providers: [SchoolServices]
})
export class SchoolManagementModule { }
