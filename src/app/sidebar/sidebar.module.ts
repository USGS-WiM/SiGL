import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidebarComponent } from './sidebar.component';
import { SharedModule } from "app/shared/shared.module";
import { MainviewModule } from "app/mainview/mainview.module";

@NgModule({
  imports: [ CommonModule, SharedModule, MainviewModule, FormsModule, ReactiveFormsModule], 
  declarations: [SidebarComponent],
  exports: [ SidebarComponent ]
})

export class SidebarModule { }
