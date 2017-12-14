import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import { BasemapsComponent } from "../mainview/basemaps/basemaps.component";
import { ModalService } from "../shared/services/modal.service";
import { IchosenFilters } from "../shared/interfaces/chosenFilters.interface";
import { Ifilteredproject } from "../shared/interfaces/filteredproject";
import { Isimplesite } from "../shared/interfaces/simplesite";
import { Ifullproject } from '../shared/interfaces/fullproject.interface';

import { SiglService } from "../shared/services/siglservices.service";
import { MapService } from '../shared/services/map.service';

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	@ViewChild('acc') accordion;
	public chosenFilters: IchosenFilters;
	public filterCount: number;
	private AllShowingProjIds: Array<number>;
	public filteredProjects: Array<Ifilteredproject>;
	public allFilteredProjectsHolder:Array<Ifilteredproject>;
	private selectedProjectId: Number;
	public siteWasClicked: boolean;
	public siteClickFullProj: Ifullproject;
	public siteCountForm: FormGroup;
	public sortByObject: any;
	public chosenSortBy: any;
	public projectsWithSitesShowing: boolean;
	constructor(private _modalService: ModalService, private _siglService: SiglService, private _mapService: MapService, private _formBuilder: FormBuilder) { }

	ngOnInit() {
		this.sortByObject = [
			{title: "Project Name A-Z", sortBy: "ProjectName", direction: "asc"},
			{title: "Project Name Z-A", sortBy: "ProjectName", direction: "des"},
			{title: "Total Site Count A-Z", sortBy: "TotalSiteCnt", direction: "asc"},
			{title: "Total Site Count Z-A", sortBy: "TotSiteCnt", direction: "des"},
			{title: "Filtered Site Count A-Z", sortBy: "FiltSiteCnt", direction: "asc"},
			{title: "Filtered Site Count Z-A", sortBy: "FiltSiteCnt", direction: "des"}
		];
		this.projectsWithSitesShowing = true;
			
		this.AllShowingProjIds = []; //holder of projects that are toggled to show all for mapview to use
		this.filterCount = 0;
		//site toggle button group form
		this.siteCountForm = this._formBuilder.group({
			'model': 'filtered'
		});
		this.filteredProjects = []; this.allFilteredProjectsHolder = [];
		//initialize selected project Id first time.
		this.selectedProjectId = -1;
		//for the filtered choices accordion panel
		this._siglService.chosenFilters.subscribe((choices: IchosenFilters) => {
			this.chosenFilters = choices;
			this.filterCount = Object.keys(this.chosenFilters).length;
			if (this.filterCount == 0) {
				this.siteClickFullProj = undefined;
			}
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
			this.filteredProjects = []; 
			if (projects.length > 0){
				this.accordion.activeIds = ['projList'];
			projects.forEach((p:Ifilteredproject) => {
				p.isCollapsed = true;					
				p.filteredSiteCount = 0;
				p.projectSites.forEach((s:Isimplesite) =>{
					if (s.isDisplayed)
						p.filteredSiteCount++;
				});
				this.filteredProjects.push(p);
			});
			} else {
				//clear it all
				this.filteredProjects = [];
			}	
			this.allFilteredProjectsHolder = this.filteredProjects.map(x => Object.assign({}, x));
		});
	}

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showModal = true;
	}

	public showProjectDetails(project: any): void{
		this._siglService.setsitePointClickBool(false); //let mainview know proj name was clicked (not site point anymore)
		
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
	
	// toggle between showing only filtered sites and all sites under a project value = 'all' or 'filtered'
	public toggleSiteList(value: string, projectId: number) {
		this.filteredProjects.forEach((p:Ifilteredproject) => {
			if (p.project_id == projectId) {
				//is this project_id in our AllShowingProjIds array? 
				if (value == 'all') {
					if (this.AllShowingProjIds.indexOf(projectId) < 0) {
						this.AllShowingProjIds.push(projectId);
					}
				} else {
					if (this.AllShowingProjIds.indexOf(projectId) > -1) {						
						this.AllShowingProjIds.splice(this.AllShowingProjIds.indexOf(projectId), 1);
					}
				}
				p.projectSites.forEach((s:Isimplesite) => {
					if (value == 'all'){						
						//show me only filtered
						if (!s.isDisplayed) {
							s.isTempDisplayed = true;
						}
					} else {						
						//show me only filtered
						if (s.isTempDisplayed) {
							s.isTempDisplayed = false;
						}
					}
				});
			}
		});		
		//now add or remove from the map and let know the AllShowingProjIds updated (if so)
		if (value == 'all') {
			this._mapService.AddTempSites(projectId);
			this._mapService.setAllShowingProjectIds(this.AllShowingProjIds);
		 } else {
			 this._mapService.RemoveTempSites(projectId);
		 }

	}

	public sortProjListBy(chosenSort: any){
		if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "asc") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.name < rightside.name) return -1;
				if (leftSide.name > rightside.name) return 1;
				return 0;
			});
		} 
		if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "des") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.name < rightside.name) return 1;
				if (leftSide.name > rightside.name) return -1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "TotSiteCnt" && chosenSort.direction == "asc") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.projectSites.length < rightside.projectSites.length) return -1;
				if (leftSide.projectSites.length > rightside.projectSites.length) return 1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "TotSiteCnt" && chosenSort.direction == "des") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.projectSites.length < rightside.projectSites.length) return 1;
				if (leftSide.projectSites.length > rightside.projectSites.length) return -1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "FiltSiteCnt" && chosenSort.direction == "asc") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.filteredSiteCount < rightside.filteredSiteCount) return -1;
				if (leftSide.filteredSiteCount > rightside.filteredSiteCount) return 1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "FiltSiteCnt" && chosenSort.direction == "des") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.filteredSiteCount < rightside.filteredSiteCount) return 1;
				if (leftSide.filteredSiteCount > rightside.filteredSiteCount) return -1;
				return 0;
			});
		}
	};

	public toggleSiteProjects(onOrOff) {
		if (this.projectsWithSitesShowing) {	
			this.projectsWithSitesShowing = false;		
			this.filteredProjects = this.allFilteredProjectsHolder.filter((proj:Ifilteredproject) => {return proj.projectSites.length > 0;});
		} else {
			this.projectsWithSitesShowing = true;	
			this.filteredProjects = this.allFilteredProjectsHolder.map(x => Object.assign({}, x));
		}
	}
		
}
