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
