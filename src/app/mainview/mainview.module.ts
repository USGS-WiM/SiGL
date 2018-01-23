// ------------------------------------------------------------------------------
// ------------ mainview.module -------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The Module for the mapview and basemaps

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../shared/shared.module";
import { BasemapsComponent } from './basemaps/basemaps.component';
import { MapviewComponent } from './map/mapview.component';
import { ResizableModule } from 'angular-resizable-element';
import { LayersComponent } from './layers/layers.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [ CommonModule, FormsModule, SharedModule, ResizableModule ], 
  declarations: [ MapviewComponent, BasemapsComponent, LayersComponent ],
  exports: [ MapviewComponent, BasemapsComponent,LayersComponent ]
})

export class MainviewModule { }
