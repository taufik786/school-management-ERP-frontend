import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CommonServices {
  isloader = new Subject<Boolean>();
  _popupAlertOpen = new Subject<Boolean>();
  snackbarInfo = new BehaviorSubject<any>({});

  preloaderOpen(flag: boolean) {
    this.isloader.next(flag);
  }
  popupAlert(flag: boolean) {
    this._popupAlertOpen.next(flag);
  }

  snackbarAlert(snackObj: any) {
    this.snackbarInfo.next(snackObj);
  }

  convertToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = function () {
        reject('Could not load image');
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }
}
