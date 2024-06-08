import { Pipe, PipeTransform } from '@angular/core';
// import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'formValidation'
})
export class FormValidationPipe implements PipeTransform {
  transform(errors: any): any[] {
    // console.log(formGroup, controlName)
    // const control = formGroup.get(controlName);
    // if (!control || !control.errors) return [];

    // const errors = control.errors;
    const errList = Object.keys(errors);
    // console.log(errList);

    if (errList.length === 0) {
      return [];
    }
    let errorMessages: string[] = [];

    // Loop through each validation error and generate error messages
    // for (const errorName in errList) {
      errList.forEach((errorName: string) => {
      switch (errorName) {
        case 'required':
          errorMessages.push('This field is required.');
          break;
        case 'email':
          errorMessages.push('Please provide valid email.');
          break;
        case 'minlength':
          errorMessages.push(`Minimum length is ${errors['minlength'].requiredLength}.`);
          break;
        case 'maxlength':
          errorMessages.push(`Maximum length  is ${errors['maxlength'].requiredLength}.`);
          break;
        case 'pattern':
          // errorMessages.push(`Invalid ${controlName}.`);
          errorMessages.push(`Please provide valid input.`);
          break;
        case 'matDatepickerParse':
            // errorMessages.push(`Invalid ${controlName}.`);
            errorMessages.push(`Invalid date.`);
            break; 
        // Add more cases for other validation types as needed
        default:
          errorMessages.push('Invalid.');
      }
    });
    return errorMessages;
  }
}
