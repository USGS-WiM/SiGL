import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainviewComponent } from './mainview.component';
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    CommonModule, SharedModule
  ],
  declarations: [MainviewComponent],
  exports: [
    MainviewComponent
  ]
})

export class MainviewModule { }
