// ------------------------------------------------------------------------------
// ------------ app.module ------------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The Module for the app. Contains the SharedModule, SidebarModule, NavbarModule, and MainviewModule

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SidebarModule } from "app/sidebar/sidebar.module";
import { NavbarModule } from "app/navbar/navbar.module";
import { MainviewModule } from "app/mainview/mainview.module";
import { SharedModule } from "app/shared/shared.module";


@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FormsModule, HttpModule,  SharedModule, SidebarModule, NavbarModule, MainviewModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
