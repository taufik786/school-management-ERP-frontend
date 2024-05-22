import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolManagementComponent } from './school-management.component';

const routes: Routes = [
  {path:"school-management", component: SchoolManagementComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolManagementRoutingModule { }
