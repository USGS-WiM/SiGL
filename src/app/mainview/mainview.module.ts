import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { BasemapsComponent } from './basemaps/basemaps.component';
import { MainviewComponent } from './mainview.component';

@NgModule({
  imports: [ CommonModule, SharedModule ], 
  declarations: [ MainviewComponent, BasemapsComponent],
  exports: [ MainviewComponent, BasemapsComponent ]
})

export class MainviewModule { }
