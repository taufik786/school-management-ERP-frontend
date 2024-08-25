import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class CommonServices {
  isloader = new Subject<Boolean>();
  isAlertOpen = new Subject<Boolean>();
  alertInfo = new BehaviorSubject<any>({});

  updateLoader(flag: boolean) {
    this.isloader.next(flag);
  }
  alertOpen(flag: boolean) {
    this.isAlertOpen.next(flag);
  }

  alertMessage(messageObj: any) {
    this.alertInfo.next(messageObj);
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
