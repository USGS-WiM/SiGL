import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SharedModule } from "app/shared/shared.module";
import { MainviewModule } from "app/mainview/mainview.module";

@NgModule({
  imports: [ CommonModule, SharedModule, MainviewModule ], 
  declarations: [SidebarComponent],
  exports: [ SidebarComponent ]
})

export class SidebarModule { }
