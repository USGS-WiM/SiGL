import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { BasemapsComponent } from './basemaps/basemaps.component';
import { MainviewComponent } from './mainview.component';
import { ResultsComponent } from './results/results.component';

@NgModule({
  imports: [ CommonModule, SharedModule ], 
  declarations: [ MainviewComponent, BasemapsComponent, ResultsComponent],
  exports: [ MainviewComponent, BasemapsComponent, ResultsComponent ]
})

export class MainviewModule { }
