import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentServices } from '../../services/student.service';
import { Subscription } from 'rxjs';
import { CommonServices } from 'src/app/services/common.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {

  @ViewChild(IonModal) modal: IonModal | any;
  studentForm: FormGroup | any;
  addSchoolSubscription: Subscription | any;
  @Output() dataEvent = new EventEmitter<any>();
  @Input() formData: any;
  @Input() isOpen: any = false;

  toastObj: any;

  fileToUpload: any;
  imageUrl: any;

  constructor(private studentServices: StudentServices, private commonServices: CommonServices) {
  }

  ngOnInit() {
    this.isOpen = this.formData.formOpen;
    this.studentForm = new FormGroup({
      // personal Details
      FirstName: new FormControl(this.setFormData('FirstName'), [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(250),
      ]),
      MiddleName: new FormControl(this.setFormData('MiddleName'), [
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      LastName: new FormControl(this.setFormData('LastName'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      Gender: new FormControl(this.setFormData('Gender'), [
        Validators.required
      ]),
      Religion: new FormControl(this.setFormData('Religion'), [
        Validators.required
      ]),
      Category: new FormControl(this.setFormData('Category'), [
        Validators.required
      ]),
      Date_of_birth: new FormControl(this.setFormData('Date_of_birth') || new Date('2/1/2021'), [
        Validators.required
      ]),
      Caste: new FormControl(this.setFormData('Caste'), [
        Validators.required
      ]),
      BloodGroup: new FormControl(this.setFormData('BloodGroup'), [
        Validators.required
      ]),
      CurrentAddress: new FormControl(this.setFormData('CurrentAddress'), [
        Validators.required
      ]),
      PermanentAddress: new FormControl(this.setFormData('PermanentAddress'), [
        Validators.required
      ]),
      Email: new FormControl(this.setFormData('Email'), [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.email
      ]),
      PhoneNumber: new FormControl(this.setFormData('PhoneNumber'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]),
      // Admission Details
      Class: new FormControl(this.setFormData('Class'), [
        Validators.required
      ]),
      Section: new FormControl(this.setFormData('Section'), [
        Validators.required
      ]),
      AdmissionNumber: new FormControl(this.setFormData('AdmissionNumber'), [
        Validators.required
      ]),
      RollNumber: new FormControl(this.setFormData('RollNumber'), [
        Validators.required
      ]),
      Photo: new FormControl(this.setFormData('Photo'), [
        // Validators.required
      ]),
      AdmissionDate: new FormControl(new Date(this.setFormData('AdmissionDate')) || new Date('2/1/20224'), [
        Validators.required,
      ]),
      Session: new FormControl(new Date(this.setFormData('Session')) || new Date('6/5/2024'), [
        // Validators.required,
      ]),
      PreviousSchool: new FormControl(this.setFormData('PreviousSchool'), [
        // Validators.required
      ]),
      //Parent Details
      FatherName: new FormControl(this.setFormData('FatherName'), [
        Validators.required
      ]),
      FatherOccupation: new FormControl(this.setFormData('FatherOccupation'), [
        // Validators.required
      ]),
      MotherName: new FormControl(this.setFormData('MotherName'), [
        Validators.required
      ]),
      MotherOccupation: new FormControl(this.setFormData('MotherOccupation'), [
        // Validators.required
      ]),
      FatherPhoneNumber: new FormControl(this.setFormData('FatherPhoneNumber'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]),
      MotherPhoneNumber: new FormControl(this.setFormData('MotherPhoneNumber'), [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{1,14}$/),
        Validators.minLength(10),
        Validators.maxLength(12)
      ]),
      Remarks: new FormControl(this.setFormData('Remarks'), [
        // Validators.required
      ]),
      username: new FormControl(this.setFormData('username'), [
        // Validators.required
      ]),
      _id: new FormControl(this.setFormData('_id')),
    });
  }

  handleFileInput(file: any) {
    console.log(file);
    this.fileToUpload = file.target.files.item(0);
    this.studentForm.controls.Photo.setValue(file.target.files[0], { onlySelf: true});

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
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
    return this.studentForm.controls[control].invalid && (this.studentForm.controls[control].dirty || this.studentForm.controls[control].touched)
  }

  async save() {
    this.toastObj = {
      isOpen: false,
      message: "",
      color: 'primary'
    };
    this.commonServices.updateLoader(true);
    if (this.studentForm.invalid) {
      this.toastObj.isOpen = true;
      this.toastObj.color = 'danger';
      this.toastObj.message = "Please fix higlighted issue.";
      this.commonServices.updateToastMessage(this.toastObj);
      this.commonServices.updateLoader(false);
      this.markFormTouched(this.studentForm);
      return;
    }

    if (this.formData.formAction === 'Add') {
      let addData = this.studentForm.value;
      delete addData._id;
      this.addSchoolSubscription = await this.studentServices.addStudent(addData).subscribe((res: any) => {
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
      this.addSchoolSubscription = await this.studentServices.editStudent(this.studentForm.value).subscribe((res: any) => {
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
