import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoggedInGuard } from './loggedIn.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent,canActivate: [LoggedInGuard] },
  { path: 'forget-password', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
