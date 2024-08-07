import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonDatetime, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchoolServices } from '../../services/school.service';
import { Subscription } from 'rxjs';
import { CommonServices } from 'src/app/services/common.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-school-management-form',
  templateUrl: './school-management-form.component.html',
  styleUrls: ['./school-management-form.component.scss'],
})
export class SchoolManagementFormComponent implements OnInit {

  @ViewChild(IonModal) modal: IonModal | any;
  schoolForm: FormGroup | any;
  addSchoolSubscription: Subscription | any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() formData: any;
  @Input() isOpen: any = false;

  toastObj: any;

  constructor(private schoolServices: SchoolServices, private commonServices: CommonServices) {
  }

  ngOnInit() {
    this.isOpen = this.formData.formOpen;
    this.schoolForm = new FormGroup({
      SchoolName: new FormControl(this.setFormData('SchoolName'), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      DirectorName: new FormControl(this.setFormData('DirectorName'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      SchoolType: new FormControl(this.setFormData('SchoolType'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      Address: new FormControl(this.setFormData('Address'), [
        Validators.required
      ]),
      PhoneNumber: new FormControl(this.setFormData('PhoneNumber'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]),
      Email: new FormControl(this.setFormData('Email'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.email
      ]),
      Remarks: new FormControl(this.setFormData('Remarks'), [
        Validators.maxLength(12),
      ]),
      Established: new FormControl(new Date(this.setFormData('Established')), [
        Validators.required,
      ]),
      _id: new FormControl(this.setFormData('_id')),
    });
  }

  setFormData(controlName: string) {
    if (!(this.formData.formData === undefined || this.formData.formData === null)) {
      return this.formData.formData[controlName];
    } else {
      return '';
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.dataEvent.emit(null);
  }

  isErrorMessage(control: string): boolean {
    return this.schoolForm.controls[control].invalid && (this.schoolForm.controls[control].dirty || this.schoolForm.controls[control].touched)
  }

  async save() {
    this.toastObj = {
      isOpen: false,
      message: "",
      color: 'primary'
    };
    this.commonServices.updateLoader(true);
    if (this.schoolForm.invalid) {
      this.toastObj.isOpen = true;
      this.toastObj.color = 'danger';
      this.toastObj.message = "Please fix higlighted issue.";
      this.commonServices.updateToastMessage(this.toastObj);
      this.commonServices.updateLoader(false);
      this.markFormTouched(this.schoolForm);
      return;
    }

    if (this.formData.formAction === 'Add') {
      let addData = this.schoolForm.value;
      delete addData._id;
      this.addSchoolSubscription = await this.schoolServices.addSchool(addData).subscribe((res: any) => {
        this.formData.formData = res.data;
        this.dataEvent.emit(this.formData);
        this.commonServices.updateLoader(false);

        this.toastObj.isOpen = true;
        this.toastObj.color = 'success';
        this.toastObj.message = res.message;
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
        this.modal.dismiss(this.formData, 'save');
      }, (err: any) => {
        this.toastObj.isOpen = true;
        this.toastObj.color = 'danger';
        this.toastObj.message = 'unable to save at this moment try after sometimes.';
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
      });
    } else {
      this.addSchoolSubscription = await this.schoolServices.editSchool(this.schoolForm.value).subscribe((res: any) => {
        this.formData.formData = res.data;
        this.dataEvent.emit(this.formData);

        this.toastObj.isOpen = true;
        this.toastObj.color = 'success';
        this.toastObj.message = res.message;
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
        this.modal.dismiss(this.formData, 'save');
      }, (err: any) => {
        this.toastObj.isOpen = true;
        this.toastObj.color = 'danger';
        this.toastObj.message = 'unable to save at this moment try after sometimes.';
        this.commonServices.updateToastMessage(this.toastObj);
        this.commonServices.updateLoader(false);
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

  onWillDismiss(event: Event) {
    this.modal.dismiss(null, 'cancel');
    this.dataEvent.emit(null);
  }

  ngOnDestroy(): void {
    if (this.addSchoolSubscription) {
      this.addSchoolSubscription.unsubscribe();
    }
    this.modal.dismiss(null, 'cancel');
    this.dataEvent.emit(null);
    this.commonServices.updateLoader(false);
  }

}
