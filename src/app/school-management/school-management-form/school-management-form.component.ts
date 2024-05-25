import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchoolServices } from '../../services/school.service';
import { Subscription } from 'rxjs';

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
  // @Input() selectedRecord: any;


  constructor(private schoolServices: SchoolServices) {
    console.log("--------------", this)
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
        Validators.required,
        Validators.maxLength(10),
      ]),
      phone: new FormControl(this.setFormData('phone'), [
        Validators.required,
        Validators.maxLength(12),
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

  async save() {
    if (!this.schoolForm.valid) {
      console.log(this.schoolForm);
      return;
    }
    console.log(this.schoolForm.value, this.formData);
    if (this.formData.formAction === 'Add') {
      this.addSchoolSubscription = await this.schoolServices.addSchool(this.schoolForm.value).subscribe((res: any) => {
        this.formData.formData = res.data;
        this.dataEvent.emit(this.formData);
        this.modal.dismiss(this.formData, 'save');
      }, (err: any) => {
        console.log(err, "eeeeeeeeee")
      });
    } else {
      this.addSchoolSubscription = await this.schoolServices.editSchool(this.schoolForm.value).subscribe((res: any) => {
        this.formData.formData = res.data;  
        this.dataEvent.emit(this.formData);
        this.modal.dismiss(this.formData, 'save');
      }, (err: any) => {
        console.log(err, "eeeeeeeeee")
      });
    }
  }

  onWillDismiss(event: Event) {
    this.modal.dismiss(null, 'cancel');
    this.dataEvent.emit(null);
  }
  ngOnDestroy(): void {
    console.log('ondestroy')
    if (this.addSchoolSubscription) {
      this.addSchoolSubscription.unsubscribe();
    }
    this.modal.dismiss(null, 'cancel');
    this.dataEvent.emit(null);
  }

}
