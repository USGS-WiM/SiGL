import { Component, OnInit, ViewChild } from '@angular/core';
import { BasemapsComponent } from "../mainview/basemaps/basemaps.component";
import { ModalService } from "../shared/services/modal.service";
import { SiglService } from "../shared/services/siglservices.service";
import { IchosenFilters } from "../shared/interfaces/chosenFilters.interface";
//import { Isite } from "app/shared/interfaces/site.interface";
import { Ifilteredproject } from "../shared/interfaces/filteredproject";
import { Isimplesite } from "../shared/interfaces/simplesite";
import { Ifullproject } from '../shared/interfaces/fullproject.interface';

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	@ViewChild('acc') accordion;
	public chosenFilters: IchosenFilters;
	//public filteredSites: Array<Isite>;
	public filteredProjects: Array<Ifilteredproject>;
	private selectedProjectId: Number;
	public siteWasClicked: boolean;
	public siteClickFullProj: Ifullproject;

	constructor(private _modalService: ModalService, private _siglService: SiglService) { }

	ngOnInit() {
		this.filteredProjects = [];
		//initialize selected project Id first time.
		this.selectedProjectId = -1;
		//for the filtered choices accordion panel
		this._siglService.chosenFilters.subscribe((choices: IchosenFilters) => {
			this.chosenFilters = choices;
		});
		this._siglService.sitePointClickBool.subscribe((val: boolean) => {
			this.siteWasClicked = val;
		});
		this._siglService.fullProject.subscribe((fullProj: Ifullproject) => {	
			this.accordion.activeIds = ['projList'];			
			this.siteClickFullProj = fullProj;
		//	this.siteClickFullProj.isCollapsed = true;
		});

		//for the results accordion panel
		this._siglService.filteredProjects.subscribe((projects: Array<Ifilteredproject>) => {			
			this.accordion.activeIds = ['projList'];
			projects.forEach((p:Ifilteredproject) => {
				p.isCollapsed = true;	
				this.filteredProjects.push(p);
			})
		});

	}

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showModal = true;
	}

	public showProjectDetails(project: any): void{
		let projID = project.project_id || project.ProjectId;
		this.selectedProjectId = projID;
		this._siglService.setFullProject(this.selectedProjectId.toString());
	}

	public showSiteDetails(site: Isimplesite): void {
		if (site.project_id != this.selectedProjectId){
			this.selectedProjectId = site.project_id;
			this._siglService.setFullProject(site.project_id.toString());
		}
		this._siglService.setFullSite(site.site_id.toString());
	}

}
