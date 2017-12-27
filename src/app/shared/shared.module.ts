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
import { LoaderService } from '../shared/services/loader.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { UserGuideComponent } from '../shared/components/userguide/userguide.component';
import { SideLoaderComponent } from '..//shared/components/loader/sidebarloader.component';


@NgModule({
	imports: [CommonModule, NgbModule.forRoot(), MultiselectDropdownModule, FormsModule],
	exports: [NgbModule, LoaderComponent, SideLoaderComponent,  FilterComponent, AboutComponent, UserGuideComponent, MultiselectDropdownModule, HighlightDirective ],
	declarations: [LoaderComponent, SideLoaderComponent, FilterComponent, AboutComponent, UserGuideComponent, HighlightDirective ],
	providers: [SiglService, MapService, ModalService, LoaderService ]
})
export class SharedModule { }
