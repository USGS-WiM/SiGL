import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainviewComponent } from './mainview.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MainviewComponent],
  exports: [
    MainviewComponent
  ]
})

export class MainviewModule { }
