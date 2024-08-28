import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchoolServices } from '../../services/school.service';
import { CommonServices } from 'src/app/services/common.service';

@Component({
  selector: 'app-school-management-form',
  templateUrl: './school-management-form.component.html',
  styleUrls: ['./school-management-form.component.scss'],
})
export class SchoolManagementFormComponent implements OnInit {
  schoolForm: FormGroup | any;
  @Output() formOpenStatus = new EventEmitter<any>();
  @Input() formData: any;

  snackObj: any = {
    formOpen: false,
    message: '',
    alertType: '',
  };

  public alertButtons = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        // console.log('Alert canceled');
      },
    },
    {
      text: 'Yes',
      role: 'confirm',
      handler: () => {
        // console.log('Alert confirmed');
      },
    },
  ];
  constructor(
    private schoolServices: SchoolServices,
    private commonServices: CommonServices
  ) {}

  ngOnInit() {
    this.schoolForm = new FormGroup({
      SchoolName: new FormControl(this.setFormData('SchoolName'), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      DirectorName: new FormControl(this.setFormData('DirectorName'), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      SchoolType: new FormControl(this.setFormData('SchoolType'), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      Address: new FormControl(this.setFormData('Address'), [
        Validators.required,
      ]),
      PhoneNumber: new FormControl(this.setFormData('PhoneNumber'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]),
      Email: new FormControl(this.setFormData('Email'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.email,
      ]),
      Remarks: new FormControl(this.setFormData('Remarks'), []),
      Established: new FormControl(new Date(this.setFormData('Established')), [
        Validators.required,
      ]),
      _id: new FormControl(this.setFormData('_id')),
    });
  }

  setFormData(controlName: string) {
    if (
      !(this.formData.formData === undefined || this.formData.formData === null)
    ) {
      return this.formData.formData[controlName];
    } else {
      return '';
    }
  }

  isErrorMessage(control: string): boolean {
    return (
      this.schoolForm.controls[control].invalid &&
      (this.schoolForm.controls[control].dirty ||
        this.schoolForm.controls[control].touched)
    );
  }

  save() {
    console.log(this.formData.formData, 'this.formData.formData');
    this.commonServices.preloaderOpen(true);
    if (this.schoolForm.invalid) {
      this.snackObj.formOpen = true;
      this.snackObj.alertType = 'danger';
      this.snackObj.message = 'Please fix the higlighted issue.';
      this.commonServices.snackbarAlert(this.snackObj);
      this.commonServices.preloaderOpen(false);
      this.markFormTouched(this.schoolForm);
      return;
    }

    if (this.formData.formAction === 'Add') {
      let addData = this.schoolForm.value;
      delete addData._id;
      this.schoolServices.addSchool(addData).subscribe({
        next: (res: any) => {
          this.snackObj.formOpen = true;
          this.snackObj.alertType = 'success';
          this.snackObj.message = res.message;
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
          this.formData.formData = res.data;
          this.formOpenStatus.emit(
            ((this.formData.formData = res.data), this.formData)
          );
        },
        error: (err) => {
          this.snackObj.formOpen = true;
          this.snackObj.alertType = 'danger';
          this.snackObj.message = err.error.message;
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
        },
        complete: () => {},
      });
    } else {
      this.schoolServices.editSchool(this.schoolForm.value).subscribe({
        next: (res: any) => {
          this.formData.formData = res.data;

          this.snackObj.formOpen = true;
          this.snackObj.alertType = 'success';
          this.snackObj.message = res.message;
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
          this.formOpenStatus.emit(this.formData);
        },
        error: (err) => {
          this.snackObj.formOpen = true;
          this.snackObj.alertType = 'danger';
          this.snackObj.message = err.error.message;
          this.commonServices.snackbarAlert(this.snackObj);
          this.commonServices.preloaderOpen(false);
        },
        complete: () => {},
      });
    }
  }

  private markFormTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.controls[key];
      if (control instanceof FormGroup) {
        control.markAsTouched();
        this.markFormTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  closeForm(ev: any) {
    // console.log(`Dismissed with role: ${ev.detail.role}`);
    if (ev.detail.role === 'confirm') {
      this.formOpenStatus.emit(null);
      this.snackObj.formOpen = false;
      this.commonServices.snackbarAlert(this.snackObj);
    }
  }
}
