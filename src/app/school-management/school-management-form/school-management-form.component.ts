import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchoolServices } from '../../services/school.service';
import { Subscription } from 'rxjs';
import { CommonServices } from 'src/app/services/common.service';

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
      schoolName: new FormControl(this.setFormData('schoolName'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      directorName: new FormControl(this.setFormData('directorName'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      schoolType: new FormControl(this.setFormData('schoolType'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      address: new FormControl(this.setFormData('address'), [
        Validators.required
      ]),
      phone: new FormControl(this.setFormData('phone'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]),
      email: new FormControl(this.setFormData('email'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.email
      ]),
      remarks: new FormControl(this.setFormData('remarks'), [
        Validators.maxLength(12),
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
      // this.schoolForm.controls.schoolName.markAsTouched({ onlySelf: false});
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
