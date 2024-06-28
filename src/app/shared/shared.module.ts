import { NgModule } from '@angular/core';
import { CommonPipe } from '../pipes/common.pipe';
import { FormValidationPipe } from '../pipes/formValidation.pipe';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [CommonPipe, FormValidationPipe],
  imports: [
    CommonModule
  ],
  exports: [CommonPipe, FormValidationPipe],
})
export class SharedModule { }
