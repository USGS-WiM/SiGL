import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from "app/shared/services/map.service";
import { FilterComponent } from './components/filter/filter.component';
import { ModalService } from "app/shared/services/modal.service";

@NgModule({
  imports: [ CommonModule, NgbModule.forRoot()],
  exports: [NgbModule, FilterComponent],
  declarations: [FilterComponent],
  providers: [ MapService, ModalService ]
})
export class SharedModule { }
