// ------------------------------------------------------------------------------
// ------------ mainview.module -------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The Module for the mapview and basemaps

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { BasemapsComponent } from './basemaps/basemaps.component';
import { MapviewComponent } from './map/mapview.component';
import { ResizableModule } from 'angular-resizable-element';


@NgModule({
  imports: [ CommonModule, SharedModule, ResizableModule ], 
  declarations: [ MapviewComponent, BasemapsComponent ],
  exports: [ MapviewComponent, BasemapsComponent ]
})

export class MainviewModule { }
