import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmissionManagementComponent } from './admission-management.component';
// import { StudentsDetailsComponent } from './students-details/students-details.component';
import { AdmissionFormsComponent } from './admission-forms/admission-forms.component';

const routes: Routes = [
  {
    path: 'admission-management',
    children: [
      { path: 'student', component: AdmissionManagementComponent },
      // { path: 'students-details', component: StudentsDetailsComponent },
      { path: 'admission-forms', component: AdmissionFormsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmissionManagementRoutingModule {}
