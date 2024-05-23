import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string = '';
  schoolForm: FormGroup | any;
  addSchoolSubscription: Subscription | any;
  @Output() dataEvent = new EventEmitter<any>();

  constructor(private schoolServices: SchoolServices) { }

  ngOnInit() {
    this.schoolForm = new FormGroup({
      schoolName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      directorName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      schoolType: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(10),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(12),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.email
      ]),
      remarks: new FormControl('', [
        Validators.maxLength(12),
      ]),
    });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  save(): void {
    if (!this.schoolForm.valid) {
      console.log(this.schoolForm);
      return;
    }
    console.log(this.schoolForm.value);
    this.modal.dismiss(null, 'save');
    this.addSchoolSubscription = this.schoolServices.addSchool(this.schoolForm.value).subscribe((res: any) => {
      this.modal.dismiss(null, 'save');
      console.log(res, "ttttttttt")
      // this.schoolLists = res.data;
      // this.dataSource = res.data;
      this.dataEvent.emit(res.data);
    }, (err: any) => {
      console.log(err, "eeeeeeeeee")
    })
  }

  onWillDismiss(event: Event): void {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'save') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
    console.log('event', event)
  }

  ngOnDestroy(): void {
    this.addSchoolSubscription.unsubscribe();
  }

}
