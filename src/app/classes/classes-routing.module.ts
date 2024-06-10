import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassComponent } from './class/class.component';
import { ClassReportsComponent } from './class-reports/class-reports.component';

const routes: Routes = [
  {path: "classes", children: [
    {path: "", component: ClassesComponent},
    {path: "class", component: ClassComponent},
    {path: "class-reports", component: ClassReportsComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassesRoutingModule { }
