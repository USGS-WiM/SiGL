import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { BasemapsComponent } from './basemaps/basemaps.component';
import { MapviewComponent } from './map/mapview.component';


@NgModule({
  imports: [ CommonModule, SharedModule ], 
  declarations: [ MapviewComponent, BasemapsComponent ],
  exports: [ MapviewComponent, BasemapsComponent ]
})

export class MainviewModule { }
