import { Component, EnvironmentInjector, OnInit, Optional, inject } from '@angular/core';
import { AlertController, IonRouterOutlet, IonicModule, Platform, ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  tap = 0;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private AuthServices: AuthService,
    @Optional() private routerOutlet?: IonRouterOutlet,
  ) {
    this.platform.ready().then(() => {
      // this.exitAppOnDoubleTap();
      this.exitAppOnAlert();
    });
  }
  ngOnInit(): void {
    this.AuthServices.autoAuthUser();
  }

  exitAppOnAlert() {
    if(Capacitor.getPlatform() == 'android') {
      this.platform.backButton.subscribeWithPriority(10, async() => {
        if (!this.routerOutlet?.canGoBack()) {
          this.alertExit();
        }
      });
    }
  }

  exitAppOnDoubleTap() {
    if(Capacitor.getPlatform() == 'android') {
      this.platform.backButton.subscribeWithPriority(10, async() => {
        if (!this.routerOutlet?.canGoBack()) {
            // double tap exit
            this.tap++;
            if(this.tap == 2) App.exitApp();
            else {
              this.doubleTapExitToast();
            }
        }
      });
    }
  }


  async doubleTapExitToast() {
    console.log('doubletapexit was called!');
    let toast = await this.toastCtrl.create({
      message: 'Tap back button again to exit the App before I\'m gone',
      duration: 3000,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
    const dismiss = await toast.onDidDismiss();
    if(dismiss) {
      console.log('dismiss: ', dismiss);
      this.tap = 0;
    }
  }

  async alertExit() {
    console.log('alert');
    const alert = await this.alertCtrl.create({
      header: 'Exit App',
      subHeader: 'Confirm',
      message: 'Are you sure you want to exit the App?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel'
        },
        {
          text: 'YES',
          role: 'confirm',
          handler: () => { App.exitApp(); }
        }
      ],
    });
    alert.present();
  }
}
