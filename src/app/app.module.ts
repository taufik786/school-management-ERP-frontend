import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material-module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonServices } from './services/common.service';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, SidebarComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AuthModule, AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideAnimationsAsync(), CommonServices],
  bootstrap: [AppComponent],
})
export class AppModule {}
