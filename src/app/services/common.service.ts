import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class CommonServices {
    isloader = new BehaviorSubject<boolean>(false);
    toastMessage = new BehaviorSubject<any>({});

    updateLoader(flag: boolean) {
        this.isloader.next(flag);
    }

    updateToastMessage(messageObj: any) {
        this.toastMessage.next(messageObj);
    }
}