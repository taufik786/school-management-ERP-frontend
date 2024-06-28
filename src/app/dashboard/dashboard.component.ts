import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.filteredItems = [...this.items];
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

}
