// ------------------------------------------------------------------------------
// ------------ sidebar.component -----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The sidebar component contains the basemaps selector, the filters and project list based on map click or filters chosen

import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Event } from '@angular/router/src/events';
import { DOCUMENT } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import 'rxjs/Rx';
import { PageScrollInstance, PageScrollService } from 'ng2-page-scroll';

import { BasemapsComponent } from "../mainview/basemaps/basemaps.component";
import { LayersComponent } from "../mainview/layers/layers.component";
import { FilterComponent } from "../shared/components/filter/filter.component";

import { ModalService } from "../shared/services/modal.service";
import { IchosenFilters } from "../shared/interfaces/chosenFilters.interface";
import { Ifilteredproject } from "../shared/interfaces/filteredproject";
import { Isimplesite } from "../shared/interfaces/simplesite";
import { Ifullproject } from '../shared/interfaces/fullproject.interface';
import { SiglService } from "../shared/services/siglservices.service";
import { MapService } from '../shared/services/map.service';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { NullAstVisitor } from '@angular/compiler';

declare let gtag: Function;

@Component({
	selector: 'sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	@ViewChild('acc') accordion;
	@ViewChild('sidebarContainer') private sidebarContainer: ElementRef;
	@ViewChild('FilterComponent') filterComp;
	public chosenFilters: IchosenFilters;
	public filterCount: number;
	public siteFilters: boolean;
	public projectFilters: boolean;
	private AllShowingProjIds: Array<number>;
	public allProjects: Array<Ifilteredproject>;
	public filteredProjects: Array<Ifilteredproject>;
	public allFilteredProjectsHolder: Array<Ifilteredproject>;
	public allProjectsHolder: Array<Ifilteredproject>;
	private selectedProjectId: number;
	private projectNameClickOnOff: number;
	public siteWasClicked: boolean;
	public siteCountForm: FormGroup;
	public sortByObject: any;
	public chosenSortBy: any;
	public projectsWithSitesShowing: boolean;
	public selectedSite: number; // change this every time a site name is clicked in the list of sites
	private siteNameClickOnOff: number;
	public NoMatches: boolean; // if filteredProjects come back empty, flag this true so message shows instead of emptiness
	public unHighlightProjName: boolean;
	public showMobileSidebar: boolean; // for mobile responsiveness, when 3-line menu clicked, show sidebar
	public showAllProjects: boolean; // toggle when all initial load and when filters are cleared so that all Projects show in sidebar
	public additionalLayers: any;
	public chosenLayers: Array<string>;
	public sitesCheck: boolean;
	public areasCheck: boolean;
	public cededCheck: boolean;
    public tribalCheck: boolean;
    public basinsCheck: boolean;

	constructor(private _modalService: ModalService, private _siglService: SiglService, private _mapService: MapService,
		private _formBuilder: FormBuilder, @Inject(DOCUMENT) private _document: any, private _pageScrollService: PageScrollService) { }

	ngOnInit() {
		this.chosenSortBy = undefined;
		this.NoMatches = false;
		this.unHighlightProjName = false;
		this.projectNameClickOnOff = 0;
		this.siteNameClickOnOff = 0;
		// update selected site when point is clicked in map
		this._mapService.siteClicked.subscribe(site => {
			if (Object.keys(site).length > 0) {
				//determine if they are clicking it to highlight the site or to unhighlight the site
				if (site.site_id == this.selectedSite) {
					this.siteNameClickOnOff++;
				}
				else {
					this.siteNameClickOnOff = 1;
				};

				if (site.site_id) {
					// only if they are clicking it to highlight the site set the selectedSite (determines whether it has a gray selected background)
					this.selectedSite = !(this.siteNameClickOnOff % 2 == 0) ? site.site_id : 0;
					if (this.showAllProjects) {
						// all projects are showing
						this.allProjects.forEach(proj => {
							if (site.project_id == proj.project_id) {
								proj.isCollapsed = false;
							} else {
								proj.isCollapsed = true;
							}
						});
					} else {
						this.filteredProjects.forEach(proj => {
							if (site.project_id == proj.project_id) {
								proj.isCollapsed = false;
							} else {
								proj.isCollapsed = true;
							}
						});
					}
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
			} else {
				// this is an empty site because they closed the popup or clicked somewhere else in the map
				this.selectedSite = 0;
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
		this.showAllProjects = true; // true by default because on init all projects are showing
		this.filterCount = 0;
		this.siteFilters = false; this.projectFilters = false;
		//site toggle button group form
		this.siteCountForm = this._formBuilder.group({
			'siteToggle': 'filtered'
		});
		this.filteredProjects = []; this.allFilteredProjectsHolder = []; this.allProjects = []; this.allProjectsHolder = [];
		//initialize selected project Id first time.
		this.selectedProjectId = -1;
		//for the filtered choices accordion panel
		this._siglService.chosenFilters.subscribe((choices: IchosenFilters) => {
			this.chosenFilters = choices;
			// if site filters:
			/* s_lakes, s_media, s_parameters, s_resources, s_states */
			if (choices.s_lakes || choices.s_media || choices.s_parameters || choices.s_resources || choices.s_states)
				this.siteFilters = true;
			else this.siteFilters = false;

			//if project filters:
			/* p_objectives, s_monitorEffect, s_projDuration, s_projStatus */
			if (choices.p_objectives || choices.s_monitorEffect || choices.s_projDuration || choices.s_projStatus)
				this.projectFilters = true;
			else this.projectFilters = false;

			this.filterCount = Object.keys(this.chosenFilters).length;			

		});
		this._siglService.sitePointClickBool.subscribe((val: boolean) => {
			this.siteWasClicked = val;
		});
		this._siglService.allProjects.subscribe((allProjects: Array<Ifilteredproject>) => {
			allProjects.forEach(p => {
				p.isCollapsed = true;
			});
			this.accordion.activeIds = ['filter','projList'];
			
			this.allProjects = allProjects;
			//sort them
			this.allProjects.sort((leftSide, rightside): number => {
				if (leftSide.name.toLowerCase() < rightside.name.toLowerCase()) return -1;
				if (leftSide.name.toLowerCase() > rightside.name.toLowerCase()) return 1;
				return 0;
			});
			this.allProjectsHolder = this.allProjects.map(x => Object.assign({}, x));
			this.chosenSortBy = this.sortByObject[0];
		})
		//for the results accordion panel
		this._siglService.filteredProjects.subscribe((projects: Array<Ifilteredproject>) => {
			this.filteredProjects = [];
			this.siteCountForm.controls['siteToggle'].setValue('filtered');
			if (projects.length > 0) {
				this.showAllProjects = false;
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
				
			} else {
				//clear it all
				this.filteredProjects = [];
				// HERE Show all projects only if there are no filters chosen				
				if (this.filterCount > 0) {
					this.NoMatches = true;
					this.showAllProjects = false;
				}
				else 
					this.showAllProjects = true;
			}
			if (this.chosenSortBy) {
				this.sortProjListBy(this.chosenSortBy, 'redo');
			}
			this.allFilteredProjectsHolder = this.filteredProjects.map(x => Object.assign({}, x));
		});
		// to show the sidebar when mobile	subscription that adds the class ([class.sidebar-mobile-show]) on the div to show/hide it
		this._siglService.showSidebar.subscribe((val: boolean) => {
			this.showMobileSidebar = val;
		});

		this.chosenLayers = []; //additional layers names that are checked
		this.sitesCheck = false;
		this.areasCheck = false;
		this.cededCheck = false;
        this.tribalCheck = false;
        this.basinsCheck = false;
	} // end ngOnInit()

	// show filter button click
	public showFilterModal(): void {
		// change boolean value to show the modal (filter)
		this._modalService.showFilterModal = true;
	}

	public showProjectDetails(project: any, fromToggle:boolean): void {
		this._siglService.setsitePointClickBool(false); //let mainview know proj name was clicked (not site point anymore)
		this._mapService.setSiteClicked({});
		this._mapService.setProjectNameClicked(true);
		let sameProjNameClicked: boolean = false;
		let projID = project.project_id || project.ProjectId;
		if (this.selectedProjectId == projID && !fromToggle) {
			// they clicked it again
			this.unHighlightProjName = true; //turn off gray background and bold font
			sameProjNameClicked = true;
			this.projectNameClickOnOff++;
		} else {
			// they clicked a different or new project name			
			sameProjNameClicked = false;
			this.projectNameClickOnOff = 1;
		}
		this.selectedProjectId = projID;

		// only go setFullProject if they are clicking it 'on' and not clicking it 'off'
		if (!(this.projectNameClickOnOff % 2 == 0)) {
			this._siglService.setFullProject(this.selectedProjectId.toString());
			this.unHighlightProjName = false;
		}

		gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'ProjectNameClick: ' + projID });
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

	public ClearFilt() {
		//below works to clear map and sidebar/project list
		gtag('event', 'click', {'event_category': 'Filter','event_label': 'filterCleared'});
		this.chosenFilters = {};
		this._mapService.updateFilteredSites(this.chosenFilters); //updates map geojson
		this._siglService.setFilteredSites(this.chosenFilters);
			//below, trying to import Clear()
		//this.filterComp.Clear();
			//below, copying inside of Clear() function
		/*this.filterComp.parameterSelected = [];
        this.filterComp.projDurationSelected = [];
        this.filterComp.projStatusSelected = [];
        this.filterComp.resourceSelected = [];
        this.filterComp.mediaSelected = [];
        this.filterComp.lakeSelected = [];
        this.filterComp.stateSelected = [];
        this.filterComp.monitoringEffortSelected = [];
        this.filterComp.orgSelected = undefined;
        this.filterComp.objectiveSelected = [];
        this.filterComp.projectSelected = undefined;
        //clear sidebar
        this.filterComp.chosenFiltersObj = {};
        // let the map and sidebar know everything was cleared
        this._mapService.updateFilteredSites(this.chosenFilters); //updates map geojson
		this._siglService.setFilteredSites(this.chosenFilters);*/
	}

	// toggle between showing only filtered sites and all sites under a project value = 'all' or 'filtered'
	public toggleSiteList(value: string, projectId: number) {
		// toggling now also highlights
		this.showProjectDetails(this.filteredProjects.filter(fp => {return fp.project_id == projectId;})[0], true);
		// don't need this if we are highlighting when toggle ... this.selectedProjectId = 0;
		// or this ... this.unHighlightProjName = true; // unhighlight project name if it's been clicked
		this._mapService.setSiteClicked({}); //clear selected site if one
		// or this ... this._mapService.setProjectNameClicked(false);
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

	// changing the sort order of the list of projects
	public sortProjListBy(chosenSort: any, fromWhere: string) {
		if (fromWhere == 'click')
			gtag('event', 'click', { 'event_category': 'ProjectList', 'event_label': 'SortBy: ' + chosenSort.sortBy + " : " + chosenSort.direction });
			
		// need to know which list of projects we are sorting (filtered or all)
		if (this.showAllProjects){
			if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "asc") {
				this.allProjects.sort((leftSide, rightside): number => {
					if (leftSide.name.toLowerCase() < rightside.name.toLowerCase()) return -1;
					if (leftSide.name.toLowerCase() > rightside.name.toLowerCase()) return 1;
					return 0;
				});
			}
			if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "des") {
				this.allProjects.sort((leftSide, rightside): number => {
					if (leftSide.name.toLowerCase() < rightside.name.toLowerCase()) return 1;
					if (leftSide.name.toLowerCase() > rightside.name.toLowerCase()) return -1;
					return 0;
				});
			}
			if (chosenSort.sortBy == "TotalSiteCnt" && chosenSort.direction == "asc") {
				this.allProjects.sort((leftSide, rightside): number => {
					if (leftSide.projectSites.length < rightside.projectSites.length) return -1;
					if (leftSide.projectSites.length > rightside.projectSites.length) return 1;
					return 0;
				});
			}
			if (chosenSort.sortBy == "TotalSiteCnt" && chosenSort.direction == "des") {
				this.allProjects.sort((leftSide, rightside): number => {
					if (leftSide.projectSites.length < rightside.projectSites.length) return 1;
					if (leftSide.projectSites.length > rightside.projectSites.length) return -1;
					return 0;
				});
			}			
		} else {
			if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "asc") {
				this.filteredProjects.sort((leftSide, rightside): number => {
					if (leftSide.name.toLowerCase() < rightside.name.toLowerCase()) return -1;
					if (leftSide.name.toLowerCase() > rightside.name.toLowerCase()) return 1;
					return 0;
				});
			}
			if (chosenSort.sortBy == "ProjectName" && chosenSort.direction == "des") {
				this.filteredProjects.sort((leftSide, rightside): number => {
					if (leftSide.name.toLowerCase() < rightside.name.toLowerCase()) return 1;
					if (leftSide.name.toLowerCase() > rightside.name.toLowerCase()) return -1;
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
		}
	};

	// turn off/on projects without sites
	public toggleProjectsWithSites(onOrOff) {
		if (this.projectsWithSitesShowing) {
			// only show projects with sites
			this.projectsWithSitesShowing = false;
			// are we toggling all the project or filtered projects
			if (this.showAllProjects) this.allProjects = this.allProjectsHolder.filter((proj: Ifilteredproject) => { return proj.projectSites.length > 0; });
			else this.filteredProjects = this.allFilteredProjectsHolder.filter((proj: Ifilteredproject) => { return proj.projectSites.length > 0; });
		} else {
			// show all projects (with and without sites)
			this.projectsWithSitesShowing = true;
			if (this.showAllProjects) this.allProjects = this.allProjectsHolder.map(x => Object.assign({}, x));
			else this.filteredProjects = this.allFilteredProjectsHolder.map(x => Object.assign({}, x));
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
		} else if (this.allProjects.length > 0 && this.showAllProjects) {
			// all projects download
			csvDataHolder = this.allProjects.map(x => Object.assign({}, x)); //deep copy
			csvDataHolder.forEach(d => {
				delete d.filteredSiteCount;
				delete d.isCollapsed;

				d.projectSites.forEach(s => {
					//	delete s.isDisplayed;
					delete s.isTempDisplayed;
				});
			});
			csvData = this.ConvertToCSV(csvDataHolder);
		} 
		let a = document.createElement("a");
		a.setAttribute('style', 'display:none;');
		document.body.appendChild(a);
		let blob = new Blob([csvData], { type: 'text/csv' });
		let url = window.URL.createObjectURL(blob);
		a.href = url;
		var currentDate = Date.now();
		var datePipe = new DatePipe("en-US");
		var filtDate = datePipe.transform(currentDate, 'yyyyMMdd_HHmmZ');
		var stringDate = filtDate.toString();
		a.download = 'SiGL_MapData_' + stringDate + '.csv';
		a.click();
	}

	// convert Filtered Projects to CSV data
	private ConvertToCSV(objArray) {
		let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
		let str = '';
		let row = "";
		var currentDate = Date.now();
		var datePipe = new DatePipe("en-US");
		var filteredDate = datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss Z');
		var strDate = filteredDate.toString();
		str = "#U.S. Geological Survey" + '\r\n' + "#Science in the Great Lakes (SiGL) Mapper"  + '\r\n' + "#https://sigl.wim.usgs.gov/sigl/" + '\r\n' + "#Retrieved: " + strDate + '\r\n' + '\r\n' + '"#SiGL project and site information is voluntarily provided and managed by federal and state agencies, municipalities, Tribes, universities, and nonprofit organizations. The USGS assumes no responsibility for the accuracy or completeness of information provided by other entities."' + '\r\n' + '\r\n' + "#Filters applied: " 
		//adding in applied filters in text heading
		if (this.chosenFilters) {	
			var filt = this.chosenFilters;
			str += "Project Filters: "
			if (filt.DURATIONS || filt.STATUSES || filt.MONITORS || filt.OBJS || filt.ORG || filt.ProjectName) {
				if (filt.DURATIONS) {
					str += "Project Duration: "
					for (let s = 0; s < this.chosenFilters.DURATIONS.length; s++)  {
						str += this.chosenFilters.PARAMETERS[s].name + "; "
					};
				}
				if (filt.STATUSES) {
					str += "Project Status: "
					for (let s = 0; s < this.chosenFilters.STATUSES.length; s++)  {
						str += this.chosenFilters.STATUSES[s].name + "; "
					};
				}
				if (filt.MONITORS) {
					str += "Monitoring effort or coordination: "
					for (let s = 0; s < this.chosenFilters.MONITORS.length; s++)  {
						str += this.chosenFilters.MONITORS[s].name + "; "
					};
				}
				if (filt.OBJS) {
					str += "Project Objective: "
					for (let s = 0; s < this.chosenFilters.OBJS.length; s++)  {
						str += this.chosenFilters.OBJS[s].name + "; "
					};
				}
				if (filt.ORG) {
					str += "Organization(s): " + filt.ORG + "; "
				}
				if (filt.ProjectName) {
					str += "Project Name: " + filt.ProjectName + "; "
				}
			} else {
				str += "none; "
			}
			str += "Site Filters: "
			if (filt.PARAMETERS || filt.RESOURCES || filt.MEDIA || filt.LAKES || filt.STATES) {
				if (filt.PARAMETERS) {
					str += "Parameters: "
					for (let s = 0; s < this.chosenFilters.PARAMETERS.length; s++)  {
						str += this.chosenFilters.PARAMETERS[s].name + "; "
					};
				}
				if (filt.RESOURCES) {
					str += "Resource Component: "
					for (let s = 0; s < this.chosenFilters.RESOURCES.length; s++)  {
						str += this.chosenFilters.RESOURCES[s].name + "; "
					};
				}
				if (filt.MEDIA) {
					str += "Media: "
					for (let s = 0; s < this.chosenFilters.MEDIA.length; s++)  {
						str += this.chosenFilters.MEDIA[s].name + "; "
					};
				}
				if (filt.LAKES) {
					str += "Great Lake: "
					for (let s = 0; s < this.chosenFilters.LAKES.length; s++)  {
						str += this.chosenFilters.LAKES[s].name + "; "
					};
				}
				if (filt.STATES) {
					str += "State: "
					for (let s = 0; s < this.chosenFilters.STATES.length; s++)  {
						str += this.chosenFilters.STATES[s].name + "; "
					};
				}
			} else {
				str += "none; ";
			}
		}else {
			str += "none";
		}
		str += '\r\n' + '"#If you applied any filters, this document only includes the sites that matched that filter. A project may contain additional sites that did not meet your criteria."' + '\r\n' + '\r\n'
		if (this.showAllProjects) row = "Project Name, Project ID, Organization(s), Full Project Information, Site ID, Site name, Latitude, Longitude, Country, State/Province, Lake";
		else row = "Project Name, Project ID, Organization(s), Full Project Information, Site ID, Site name, Filtered Result, Latitude, Longitude, Country, State/Province, Lake";
		// append Label row with line break
		str += row + '\r\n';

		for (let i = 0; i < array.length; i++) {
			let line = '';
			for (let index in array[i]) {
				if (line != '') line += ','
				if (Array.isArray(array[i][index])) {
					//for each site in this project, make a new line
					//trying to get through the Organizations array and the project sites array...
					if (array[i]["Organizations"] == array[i][index]) {
						if (array[i][index].length > 1) {
							for (let org = 0; org < array[i][index].length; org++) {
								line += array[i][index][org] + "; "
							}
						} else {
							line += array[i][index][0]
						}
					} else if (array[i][index] == array[i]["projectSites"]) {
						for (let s = 0; s < array[i][index].length; s++) {
							if (s == 0) {
								// is this from AllProjects?
								if (this.showAllProjects) {
									line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
								} else {
									//is this a filtered site?
									if (array[i][index][s].isDisplayed)
										line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + ",true," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
									else
										line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + ",false," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
								}
							} else {
								// is this from AllProjects?
								if (this.showAllProjects) {
									line += ",,,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
								} else {
									if (array[i][index][s].isDisplayed)
										line += ",,,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + ",true," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
									else
										line += ",,,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + ",false," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
								}
							}
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
		var currentDate = Date.now();
		var datePipe = new DatePipe("en-US");
		var filteredDate = datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss Z');
		var strDate = filteredDate.toString();
		str = "#U.S. Geological Survey" + '\r\n' + "#Science in the Great Lakes (SiGL) Mapper"  + '\r\n' + "#https://sigl.wim.usgs.gov/sigl/" + '\r\n' + "#Retrieved: " + strDate + '\r\n' + '\r\n' + '"#SiGL project and site information is voluntarily provided and managed by federal and state agencies, municipalities, Tribes, universities, and nonprofit organizations. The USGS assumes no responsibility for the accuracy or completeness of information provided by other entities."' + '\r\n' + '\r\n' + "#Filters applied: " 
		//adding in applied filters in text heading
		if (this.chosenFilters) {	
			var filt = this.chosenFilters;
			str += "Project Filters: "
			if (filt.DURATIONS || filt.STATUSES || filt.MONITORS || filt.OBJS || filt.ORG || filt.ProjectName) {
				if (filt.DURATIONS) {
					str += "Project Duration: "
					for (let s = 0; s < this.chosenFilters.DURATIONS.length; s++)  {
						str += this.chosenFilters.PARAMETERS[s].name + "; "
					};
				}
				if (filt.STATUSES) {
					str += "Project Status: "
					for (let s = 0; s < this.chosenFilters.STATUSES.length; s++)  {
						str += this.chosenFilters.STATUSES[s].name + "; "
					};
				}
				if (filt.MONITORS) {
					str += "Monitoring effort or coordination: "
					for (let s = 0; s < this.chosenFilters.MONITORS.length; s++)  {
						str += this.chosenFilters.MONITORS[s].name + "; "
					};
				}
				if (filt.OBJS) {
					str += "Project Objective: "
					for (let s = 0; s < this.chosenFilters.OBJS.length; s++)  {
						str += this.chosenFilters.OBJS[s].name + "; "
					};
				}
				if (filt.ORG) {
					str += "Organization(s): " + filt.ORG + "; "
				}
				if (filt.ProjectName) {
					str += "Project Name: " + filt.ProjectName + "; "
				}
			} else {
				str += "none; "
			}
			str += "Site Filters: "
			if (filt.PARAMETERS || filt.RESOURCES || filt.MEDIA || filt.LAKES || filt.STATES) {
				if (filt.PARAMETERS) {
					str += "Parameters: "
					for (let s = 0; s < this.chosenFilters.PARAMETERS.length; s++)  {
						str += this.chosenFilters.PARAMETERS[s].name + "; "
					};
				}
				if (filt.RESOURCES) {
					str += "Resource Component: "
					for (let s = 0; s < this.chosenFilters.RESOURCES.length; s++)  {
						str += this.chosenFilters.RESOURCES[s].name + "; "
					};
				}
				if (filt.MEDIA) {
					str += "Media: "
					for (let s = 0; s < this.chosenFilters.MEDIA.length; s++)  {
						str += this.chosenFilters.MEDIA[s].name + "; "
					};
				}
				if (filt.LAKES) {
					str += "Great Lake: "
					for (let s = 0; s < this.chosenFilters.LAKES.length; s++)  {
						str += this.chosenFilters.LAKES[s].name + "; "
					};
				}
				if (filt.STATES) {
					str += "State: "
					for (let s = 0; s < this.chosenFilters.STATES.length; s++)  {
						str += this.chosenFilters.STATES[s].name + "; "
					};
				}
			} else {
				str += "none; ";
			}
		}else {
			str += "none";
		}
		str += '\r\n' + '"#If you applied any filters, this document only includes the sites that matched that filter. A project may contain additional sites that did not meet your criteria."' + '\r\n' + '\r\n'
		row = "Project Name,Project ID, Organization(s), Full Project Information, Site ID,Site name, Latitude, Longitude, Country, State/Province, Lake"
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
							line += "https://sigldev.wim.usgs.gov/SiGLServices/projects/GetFullProject.json?ByProject=" + array[i][index][s].project_id + "," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
						} else {
							line += ",,," + array[i][index][s].site_id + "," + array[i][index][s].name.replace(/,/g, " ") + "," + array[i][index][s].latitude + "," + array[i][index][s].longitude + "," + array[i][index][s].Country + "," + array[i][index][s].State + "," + array[i][index][s].Lake + '\r\n';
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

	//toggle on/off Additional Layers
	public toggleLayer(newVal: string) {
		let index = this.chosenLayers.indexOf(newVal);

		if (index > -1) {
			//already on, turn it off and remove from array
			this.chosenLayers.splice(index, 1);
			this._mapService.map.removeLayer(this._mapService.additionalLayers[newVal]);
		} else {
			// not in there yet, turn it on and add to array
			this.chosenLayers.push(newVal);
			this._mapService.map.addLayer(this._mapService.additionalLayers[newVal]);
		}

	}
}
