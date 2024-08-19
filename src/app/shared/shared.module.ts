import { NgModule } from '@angular/core';
import { CommonPipe } from '../pipes/common.pipe';
import { FormValidationPipe } from '../pipes/formValidation.pipe';
import { CommonModule } from '@angular/common';
import { SnacbarComponent } from './snackbar/snackbar.component';
import { IonicModule } from '@ionic/angular';
import { MatIcon } from '@angular/material/icon';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    CommonPipe,
    FormValidationPipe,
    SnacbarComponent,
    SpinnerComponent,
  ],
  imports: [CommonModule, IonicModule, MatIcon],
  exports: [CommonPipe, FormValidationPipe, SnacbarComponent, SpinnerComponent],
})
export class SharedModule {}
