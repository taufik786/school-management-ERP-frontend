import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  implements OnInit {
  items: { name: string; selected: boolean }[] = [
    { name: 'Item 1', selected: false },
    { name: 'Item 2', selected: false },
    { name: 'Item 3', selected: false },
    // Add more items as needed
  ];
  
  filteredItems: { name: string; selected: boolean }[] = [];
  searchTerm: string = '';
  selectAll: boolean = false;
  @ViewChild(IonModal) modal: IonModal | any;
  isOpen: any = false;
  isDeleteOpen: any = false;
  alertButtons :any= [];

  constructor() { }

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.alertButtons = [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'OK',
        role: 'confirm'
      },
    ];
  }

  filterItems() {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(searchTermLower));
  }

  toggleSelectAll() {
    this.filteredItems.forEach(item => item.selected = this.selectAll);
  }

  submit() {
    const selectedItems = this.items.filter(item => item.selected);
    console.log('Selected Items:', selectedItems);
    // Do something with the selected items
  }

  openform(){
    this.isOpen = true
  }
  onWillDismiss(event: Event) {
    this.modal.dismiss(null, 'cancel');
    // this.dataEvent.emit(null);
  }

  closeForm(buttonEvent: any) {
    if (buttonEvent.detail.role === 'confirm') {
      this.cancel();
      this.isDeleteOpen = false;
    } else {
      this.isDeleteOpen = false;
    }
  }
  openAlertModal() {
    this.isDeleteOpen = true;
    this.isOpen = true;
    console.log('5454')
  }
  cancel() {
    this.modal.dismiss(null, 'cancel');
    // this.dataEvent.emit(null);
  }

}
