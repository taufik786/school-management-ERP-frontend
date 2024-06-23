import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Subscription } from 'rxjs';
import { CommonServices } from 'src/app/services/common.service';
import { SchoolServices } from 'src/app/services/school.service';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any = new MatTableDataSource([]);
  @Output() formOpenEvent = new EventEmitter<boolean>(false);
  @Output() editOpenEvent = new EventEmitter<any>();
  @Output() deleteOpenEvent = new EventEmitter<any>();
  @Output() deleteRecordEvent = new EventEmitter<any>();

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: any = PageEvent;
  schoolListSubscription: Subscription | any;
  deleteSchoolSubscription: Subscription | any;
  selectedRecord: any;
  selectedDeletedRecord: any;
  isDeleteOpen: boolean = false;
  message: string = '';
  formAction = 'Add';
  toastObj: any;
  alertHeader: string = '';

  formOpen = false;
  alertButtons: any = [];

  constructor(
    private schoolServices: SchoolServices, private commonServices: CommonServices) {

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.schoolList();
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
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ', changes);
    // this.dataSource.data = changes?.dataSource.currentValue.data;
    if (changes['dataSource']?.currentValue?.data) {
      this.dataSource.data = changes['dataSource'].currentValue.data;
    }
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.commonServices.updateLoader(false);
  }

  openForm(formStatus: any) {
    this.formOpen = formStatus;
    this.formAction = 'Add';
    this.selectedRecord = {
      formOpen: formStatus,
      formData: null,
      formAction: 'Add'
    };
    this.formOpenEvent.emit(true);
  }
  async schoolList(): Promise<void> {
    try {
      this.toastObj = {
        isOpen: false,
        message: '',
        color: 'primary',
      };
      await this.commonServices.updateLoader(true);

      const res: any = await this.schoolServices.allSchoolLists().toPromise();
      this.dataSource.data = [...res.data].reverse();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.toastObj = {
        isOpen: true,
        message: res.message,
        color: 'success',
      };
    } catch {
      this.dataSource.data = [];
      this.toastObj = {
        isOpen: true,
        message: 'Unable to process at this moment try after sometime.',
        color: 'danger',
      };
    } finally {
      this.commonServices.updateLoader(false);
      this.commonServices.updateToastMessage(this.toastObj);
    }
  }

  editRecord(rowData: any) {
    this.formOpen = true;
    this.formAction = 'Update';
    this.selectedRecord = {
      formOpen: true,
      formData: rowData,
      formAction: 'Update'
    };
    this.editOpenEvent.emit(rowData);
  }

  openDeleteDialog(rowData: any) {
    if (!rowData?.SchoolName) {
      throw new Error('Invalid row data or school name');
    }
    this.isDeleteOpen = true;
    this.selectedDeletedRecord = rowData;
    this.alertHeader = `Delete ${rowData.SchoolName} Data`;
    this.message = 'Are you sure to delete record?';
    this.deleteOpenEvent.emit(rowData);
  }

  deleteRecord(buttonEvent: any) {
    this.toastObj = {
      isOpen: false,
      message: "",
      color: 'primary'
    };
    this.deleteRecordEvent.emit(buttonEvent);
    // if (buttonEvent.detail.role === 'confirm') {
    //   this.commonServices.updateLoader(true);
    //   this.deleteSchoolSubscription = this.schoolServices.deleteSchool(this.selectedDeletedRecord._id).subscribe((res: any) => {
    //     this.isDeleteOpen = false;
    //     let newData = this.dataSource.data.filter((scl: any) => scl._id !== res.data._id);
    //     this.dataSource.data = newData;
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;

    //     this.toastObj.isOpen = true;
    //     this.toastObj.color = 'success';
    //     this.toastObj.message = res.message;
    //     this.commonServices.updateToastMessage(this.toastObj);
    //     this.commonServices.updateLoader(false);
    //   }, err => {
    //     this.isDeleteOpen = false;
    //     this.toastObj.isOpen = true;
    //     this.toastObj.color = 'danger';
    //     this.toastObj.message = ' unable to delete record.';
    //     this.commonServices.updateToastMessage(this.toastObj);
    //     this.commonServices.updateLoader(false);
    //   });
    // } else {
    //   this.isDeleteOpen = false;
    //   this.commonServices.updateLoader(false);
    // }
  }

  private updateDataSource(data: any) {
    this.dataSource.data = [data.formData, ...this.dataSource.data.filter((item: { _id: any; }) => item._id !== data.formData._id)];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.formOpen = false;
    this.commonServices.updateLoader(false);
  }

  receiveData(data: any) {
    if (data === null) {
      this.commonServices.updateLoader(false);
      this.formOpen = false;
      return;
    }

    this.commonServices.updateLoader(true);
    this.formAction === 'Add' ? this.updateDataSource(data) : this.updateDataSourceAfterEdit(data);
  }

  private updateDataSourceAfterEdit(data: any) {
    this.dataSource.data = this.dataSource.data.map((element: { _id: any; }) => {
      return element._id === data.formData._id ? data.formData : element;
    });
    this.commonServices.updateLoader(false);
  }

  /**
   * Capitalizes the first letter of each word in the given string, except for
   * the specified special keys.
   *
   * @param {string} key - The string to capitalize.
   * @return {string} The capitalized string.
   */
  capitalize(key: string): string {
    if (key === '__v' || key === '_id' || key === 'Deleted') {
      return key;
    }
    return key.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, (match) => match.toUpperCase());
  }

  /**
   * Applies a filter to the data source based on the provided event value.
   *
   * @param {any} event - The event object that triggered the filter.
   * @return {void} This function does not return anything.
   */
  applyFilter(event: any) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    if (this.schoolListSubscription) {
      this.schoolListSubscription.unsubscribe();
    }
    if (this.deleteSchoolSubscription) {
      this.deleteSchoolSubscription.unsubscribe();
    }
    this.commonServices.updateLoader(false);
  }

  exportToExcel(): void {
    if (!this.dataSource || !this.dataSource.data) {
      console.error('No data to export');
      return;
    }
    try {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'MatTableData.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }
  async generatePdf(element: any) {
    let tableBody: any[][] = [];
    await Object.keys(element).forEach((key) => {
      if (!(key === '__v' || key === '_id' || key === 'Deleted')) {
        const keyName = key.replace(/([A-Z])/g, " $1");
        const finalKey = key.replace(/([A-Z])/g, " $1").charAt(0).toUpperCase() + keyName.slice(1);
        tableBody.push([finalKey, element[key] === '' ? 'NIL' : element[key]]);
      }
    });
    const documentDefinition: any = {
      content: [
        {
          columns: [
            {
              image: await this.commonServices.convertToBase64('assets/ERP.png'),
              width: 100,
              height: 100
            },
            {
              text: 'School Management ERP',
              style: 'header',
              alignment: 'center',
              margin: [0, 35, 0, 0]  // Adjust the margin to align with the images
            },
            {
              image: await this.commonServices.convertToBase64('assets/photo.png'),
              width: 100,
              height: 100
            }
          ]
        },
        {
          style: 'tableExample',
          table: {
            heights: 25,
            widths: [150, 350],
            alignment: 'center',
            body: tableBody
          }
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        alignment: 'justify'
      }
    };
    pdfMake.createPdf(documentDefinition).open();
    // pdfMake.createPdf(documentDefinition).download();
  }
}
