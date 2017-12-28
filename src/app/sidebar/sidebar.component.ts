// ------------------------------------------------------------------------------
// ------------ sidebar.component -----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The sidebar component contains the basemaps selector, the filters and project list based on map click or filters chosen

import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { Event } from '@angular/router/src/events';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { transition } from '@angular/core/src/animation/dsl';
import 'rxjs/Rx';
import { PageScrollInstance, PageScrollService } from 'ng2-page-scroll';

import { BasemapsComponent } from "../mainview/basemaps/basemaps.component";

import { ModalService } from "../shared/services/modal.service";
import { IchosenFilters } from "../shared/interfaces/chosenFilters.interface";
import { Ifilteredproject } from "../shared/interfaces/filteredproject";
import { Isimplesite } from "../shared/interfaces/simplesite";
import { Ifullproject } from '../shared/interfaces/fullproject.interface';
import { SiglService } from "../shared/services/siglservices.service";
import { MapService } from '../shared/services/map.service';

declare let gtag: Function;

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	@ViewChild('acc') accordion;
	@ViewChild('sidebarContainer') private sidebarContainer: ElementRef;
	public chosenFilters: IchosenFilters;
	public filterCount: number;
	private AllShowingProjIds: Array<number>;
	public filteredProjects: Array<Ifilteredproject>;
	public allFilteredProjectsHolder: Array<Ifilteredproject>;
	private selectedProjectId: Number;
	public siteWasClicked: boolean;
	public siteClickFullProj: Ifullproject;
	public siteCountForm: FormGroup;
	public sortByObject: any;
	public chosenSortBy: any;
	public projectsWithSitesShowing: boolean;
	public selectedSite: number; // change this every time a site name is clicked in the list of sites
	public NoMatches: boolean; // if filteredProjects come back empty, flag this true so message shows instead of emptiness
	public unHighlightProjName: boolean;
	constructor(private _modalService: ModalService, private _siglService: SiglService, private _mapService: MapService,
		private _formBuilder: FormBuilder, @Inject(DOCUMENT) private _document: any, private _pageScrollService: PageScrollService) { }

	ngOnInit() {
		this.chosenSortBy = undefined;
		this.NoMatches = false;
		this.unHighlightProjName = false;
		// update selected site when point is clicked in map
		this._mapService.siteClicked.subscribe(site => {
			this.selectedSite = site.site_id || 0;
			if (site.site_id) {
				this.filteredProjects.forEach(proj => {
					if (site.project_id == proj.project_id) {
						proj.isCollapsed = false;
					} else {
						proj.isCollapsed = true;
					}
				});
			}
			// scroll down to the site id chosen
			if (site.fromMap == true) {
				let idName: string = "#site_" + site.site_id.toString();
				let sideBARContent = this.sidebarContainer.nativeElement;
				setTimeout(() => {
					let pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance(
						{
							document: this._document,
							scrollTarget: idName,
							scrollingViews: [sideBARContent]
						});
					this._pageScrollService.start(pageScrollInstance);
				}, 1000);
			}
		});
		this.sortByObject = [
			{ title: "Project Name: ", icon: "&#xf15d;", sortBy: "ProjectName", direction: "asc" },
			{ title: "Project Name: ", icon: "&#xf15e;", sortBy: "ProjectName", direction: "des" },
			{ title: "Total Site Count: ", icon: "&#xf162;", sortBy: "TotalSiteCnt", direction: "asc" },
			{ title: "Total Site Count: ", icon: "&#xf163;", sortBy: "TotalSiteCnt", direction: "des" },
			{ title: "Filtered Site Count: ", icon: "&#xf162;", sortBy: "FilteredSiteCnt", direction: "asc" },
			{ title: "Filtered Site Count: ", icon: "&#xf163;", sortBy: "FilteredSiteCnt", direction: "des" }
		];
		this.projectsWithSitesShowing = true;

		this.AllShowingProjIds = []; //holder of projects that are toggled to show all for mapview to use
		this.filterCount = 0;
		//site toggle button group form
		this.siteCountForm = this._formBuilder.group({
			'siteToggle': 'filtered'
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
				this.chosenSortBy = undefined;
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
			this.siteCountForm.controls['siteToggle'].setValue('filtered');
			if (projects.length > 0) {
				this.NoMatches = false;
				this.accordion.activeIds = ['projList'];
				projects.forEach((p: Ifilteredproject) => {
					p.isCollapsed = true;
					p.filteredSiteCount = 0;
					p.projectSites.forEach((s: Isimplesite) => {
						if (s.isDisplayed)
							p.filteredSiteCount++;
					});
					this.filteredProjects.push(p);
				});
				if (this.chosenSortBy) {
					this.sortProjListBy(this.chosenSortBy, 'redo');
				}
			} else {
				//clear it all
				this.filteredProjects = [];
				if (this.filterCount > 0)
					this.NoMatches = true;
			}

			this.allFilteredProjectsHolder = this.filteredProjects.map(x => Object.assign({}, x));
		});
	}

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showFilterModal = true;
	}

	public showProjectDetails(project: any): void {
		this.unHighlightProjName = false;
		this._siglService.setsitePointClickBool(false); //let mainview know proj name was clicked (not site point anymore)
        this._mapService.setSiteClicked({});
        this._mapService.setProjectNameClicked(true);
		let projID = project.project_id || project.ProjectId;
		this.selectedProjectId = projID;
		gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'ProjectNameClick: ' + projID });
		this._siglService.setFullProject(this.selectedProjectId.toString());
	}

	public showSiteDetails(site: Isimplesite): void {
        this._mapService.setProjectNameClicked(false);
        if (site.project_id != this.selectedProjectId) {
            this.selectedProjectId = site.project_id;
		}
		gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'SiteNameClick: ' + site.site_id });
		// if project name has been highlighted, need to unhighlight if single site clicked
		this.unHighlightProjName = true;
		this._mapService.setSiteClicked({ "site_id": site.site_id, "project_id": site.project_id, "fromMap": false });
		this._siglService.setFullSite(site.site_id.toString());
	}

	// toggle between showing only filtered sites and all sites under a project value = 'all' or 'filtered'
	public toggleSiteList(value: string, projectId: number) {
        this._mapService.setSiteClicked({}); //clear selected site if one
        this._mapService.setProjectNameClicked(false);
		gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'ProjectId: ' + projectId + ', Toggle: ' + value });
		this.filteredProjects.forEach((p: Ifilteredproject) => {
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
				p.projectSites.forEach((s: Isimplesite) => {
					if (value == 'all') {
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

	public sortProjListBy(chosenSort: any, fromWhere: string) {
		if (fromWhere == 'click')
			gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'SortBy: ' + chosenSort.sortBy + " : " + chosenSort.direction });

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
		if (chosenSort.sortBy == "TotalSiteCnt" && chosenSort.direction == "asc") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.projectSites.length < rightside.projectSites.length) return -1;
				if (leftSide.projectSites.length > rightside.projectSites.length) return 1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "TotalSiteCnt" && chosenSort.direction == "des") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.projectSites.length < rightside.projectSites.length) return 1;
				if (leftSide.projectSites.length > rightside.projectSites.length) return -1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "FilteredSiteCnt" && chosenSort.direction == "asc") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.filteredSiteCount < rightside.filteredSiteCount) return -1;
				if (leftSide.filteredSiteCount > rightside.filteredSiteCount) return 1;
				return 0;
			});
		}
		if (chosenSort.sortBy == "FilteredSiteCnt" && chosenSort.direction == "des") {
			this.filteredProjects.sort((leftSide, rightside): number => {
				if (leftSide.filteredSiteCount < rightside.filteredSiteCount) return 1;
				if (leftSide.filteredSiteCount > rightside.filteredSiteCount) return -1;
				return 0;
			});
		}
	};

	// turn off/on projects without sites
	public toggleSiteProjects(onOrOff) {
		if (this.projectsWithSitesShowing) {
			// only show projects with sites
			this.projectsWithSitesShowing = false;
			this.filteredProjects = this.allFilteredProjectsHolder.filter((proj: Ifilteredproject) => { return proj.projectSites.length > 0; });
		} else {
			// show all projects (with and without sites)
			this.projectsWithSitesShowing = true;
			this.filteredProjects = this.allFilteredProjectsHolder.map(x => Object.assign({}, x));
		}
		if (this.chosenSortBy) {
			this.sortProjListBy(this.chosenSortBy, 'redo');
		}
	}

	public downloadCSV() {
		let csvDataHolder: Array<any> = [];
		let csvData: string;
		gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'Download CSV' });
		if (this.filteredProjects.length > 0) {
			// filtered projects download
			csvDataHolder = this.filteredProjects.map(x => Object.assign({}, x)); //deep copy
			csvDataHolder.forEach(d => {
				delete d.filteredSiteCount;
				delete d.isCollapsed;

				d.projectSites.forEach(s => {
					//	delete s.isDisplayed;
					delete s.isTempDisplayed;
				});
			});
			csvData = this.ConvertToCSV(csvDataHolder);
		} else {
			// single site click project download
			let tempProject = {
				"name": this.siteClickFullProj.Name,
				"id": this.siteClickFullProj.ProjectId,
				"projectSites": this.siteClickFullProj.projectSites
			}
			csvDataHolder.push(tempProject);
			csvData = this.ConvertSingleToCSV(csvDataHolder);
		}
		let a = document.createElement("a");
		a.setAttribute('style', 'display:none;');
		document.body.appendChild(a);
		let blob = new Blob([csvData], { type: 'text/csv' });
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		a.download = 'SiGL_MapData.csv';
		a.click();
	}

	// convert Filtered Projects to CSV data
	private ConvertToCSV(objArray) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = "";
		row = "Project Name, project_id, GetFullProject, projectSites__site_id,projectSites__name,projectSites__filteredResult, projectSites__latitude, projectSites__longitude "
		// append Label row with line break
		str += row + '\r\n';

		for (let i = 0; i < array.length; i++) {
			let line = '';
			for (let index in array[i]) {
				if (line != '') line += ','
				if (Array.isArray(array[i][index])) {
					//for each site in this project, make a new line
					for (let s = 0; s < array[i][index].length; s++) {
						if (s == 0) {
							//is this a filtered site?
							if (array[i][index][s].isDisplayed)
								line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + ",true," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
							else
								line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + ",false," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
						} else {
							if (array[i][index][s].isDisplayed)
								line += ",,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + ",true," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
							else
								line += ",,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + ",false," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
						}
					}
				} else {
					if (isNaN(array[i][index]))
						line += array[i][index].replace(/,/g, " ");
					else
						line += array[i][index]
				}
			}
			str += line + '\r\n';
		}
		return str;
	}
	// convert Single site click project to CSV data
	private ConvertSingleToCSV(objArray) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = "";
		row = "Project Name,project_id,GetFullProject,projectSites__site_id,projectSites__name,projectSites__latitude,projectSites__longitude"
		// append Label row with line break
		str += row + '\r\n';

		for (let i = 0; i < array.length; i++) {
			let line = '';
			for (let index in array[i]) {
				if (line != '') line += ','
				if (Array.isArray(array[i][index])) {
					//for each site in this project, make a new line
					for (let s = 0; s < array[i][index].length; s++) {
						if (s == 0) {
							line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
						} else {
							line += ",,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(",", " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + '\r\n';
						}
					}
				} else {
					if (isNaN(array[i][index]))
						line += array[i][index].replace(/,/g, " ");
					else
						line += array[i][index]
				}
			}
			str += line + '\r\n';
		}
		return str;
	}
}
