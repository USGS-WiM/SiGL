import { Component, OnInit } from '@angular/core';
import { BasemapsComponent } from "app/mainview/basemaps/basemaps.component";
import { ModalService } from "app/shared/services/modal.service";
import { SiglService } from "app/shared/services/siglservices.service";
import { IchosenFilters } from "app/shared/interfaces/chosenFilters.interface";
//import { Isite } from "app/shared/interfaces/site.interface";
import { Ifilteredproject } from "app/shared/interfaces/filteredproject";

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	public chosenFilters: IchosenFilters;
	//public filteredSites: Array<Isite>;
	public filteredProjects: Array<Ifilteredproject>;

	constructor(private _modalService: ModalService, private _siglService: SiglService) { }

	ngOnInit() {
		//for the filtered choices accordion panel
		this._siglService.chosenFilters.subscribe((choices: IchosenFilters) => {
			this.chosenFilters = choices;
		});
		/*this._siglService.filteredSites.subscribe((sites: Array<Isite>) => {
			this.filteredSites = sites;
		});*/

		//for the results accordion panel
		this._siglService.filteredProjects.subscribe((projects: Array<Ifilteredproject>) => {
			this.filteredProjects = projects;
		});

	}

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showModal = true;
	}

}
