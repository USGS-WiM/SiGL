import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SidebarComponent } from './sidebar.component';
import { SharedModule } from "app/shared/shared.module";
import { MainviewModule } from "app/mainview/mainview.module";
import { Ng2PageScrollModule } from 'ng2-page-scroll'; 

@NgModule({
  imports: [ CommonModule, SharedModule, MainviewModule, FormsModule, ReactiveFormsModule, Ng2PageScrollModule.forRoot()], 
  declarations: [SidebarComponent],
  exports: [ SidebarComponent ]
})

export class SidebarModule { }
