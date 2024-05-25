import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class CommonServices {
    isloader = new BehaviorSubject<boolean>(false);

    updateLoader() {
        this.isloader.next(!this.isloader.value);
    }
}