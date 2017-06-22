import { Component, OnInit } from '@angular/core';
import { BasemapsComponent } from "app/mainview/basemaps/basemaps.component";
import { ResultsComponent } from "app/mainview/results/results.component";
import { ModalService } from "app/shared/services/modal.service";
import { SiglService } from "app/shared/services/siglservices.service";
import { IchosenFilters } from "app/shared/interfaces/chosenFilters.interface";

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	public chosenFilters: IchosenFilters;
	constructor(private _modalService: ModalService, private _siglService: SiglService) { }

	ngOnInit() {
		this._siglService.chosenFilters.subscribe((choices: IchosenFilters) => {
			this.chosenFilters = choices;
		});



	}

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showModal = true;
	}

}
