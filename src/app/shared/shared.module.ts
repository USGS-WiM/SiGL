import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../shared/services/map.service';
import { FilterComponent } from './components/filter/filter.component';
import { ModalService } from '../shared/services/modal.service';
import { SiglService } from '../shared/services/siglservices.service';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AboutComponent } from '../shared/components/aboutmodal/about.component';
import { HighlightDirective } from '../shared/directives/highlight.directive';


@NgModule({
	imports: [CommonModule, NgbModule.forRoot(), MultiselectDropdownModule, FormsModule],
	exports: [NgbModule, FilterComponent, AboutComponent, MultiselectDropdownModule, HighlightDirective ],
	declarations: [FilterComponent, AboutComponent, HighlightDirective ],
	providers: [SiglService, MapService, ModalService ]
})
export class SharedModule { }
