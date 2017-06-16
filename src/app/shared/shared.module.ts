import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from 'app/shared/services/map.service';
import { FilterComponent } from './components/filter/filter.component';
import { ModalService } from 'app/shared/services/modal.service';
import { SiglService } from 'app/shared/services/siglservices.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


@NgModule({
  imports: [ CommonModule, NgbModule.forRoot(), MultiselectDropdownModule, FormsModule],
  exports: [NgbModule, FilterComponent, MultiselectDropdownModule],
  declarations: [FilterComponent],
  providers: [ MapService, ModalService, SiglService ]
})
export class SharedModule { }
