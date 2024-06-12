import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent  implements OnInit {

  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any = new MatTableDataSource([]);
  constructor() { }

  ngOnInit() {}

}
