import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from "app/shared/map.service";

@NgModule({
  imports: [ CommonModule, NgbModule.forRoot()],
  exports: [NgbModule],
  declarations: [],
  providers: [ MapService ]
})
export class SharedModule { }
