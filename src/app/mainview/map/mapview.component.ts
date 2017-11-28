import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MapService } from "app/shared/services/map.service";
import { FilterComponent } from "app/shared/components/filter/filter.component";
import { ResizeEvent } from "angular-resizable-element/dist/esm/src";
import { SiglService } from "app/shared/services/siglservices.service";
import { Ifullproject } from "app/shared/interfaces/fullproject.interface";
import { Ifullsite } from "app/shared/interfaces/fullsite.interface";
import { Iparameter } from "app/shared/interfaces/parameter.interface";
import { Igroupedparameters } from "app/shared/interfaces/groupedparameters";
import * as L from 'leaflet';
import { Ifilteredproject } from 'app/shared/interfaces/filteredproject';
//import * as WMS from 'leaflet.wms';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'mapview',
	templateUrl: './mapview.component.html',
	styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit {
	@ViewChild('t') tabs;
	// filter modal, opened from sidebar's (click) function that changing show boolean, subscribed to in the filterModalComponent
	@ViewChild('filtermodal') filtermodal: FilterComponent;
	public map: any;
    public wmsLayer: any;
    public icon: any;
    public highlightIcon: any;
    public geoJsonLayer: L.GeoJSON;
    public geoj: any;
	public popup: any;
	public style: Object = {};
	public fullProj: Ifullproject;
    public fullProjSites: Array<Ifullsite>;
    public filteredProjects: Array<Ifilteredproject>;
	public fullSite: Ifullsite;
	public showBottomBar: Boolean;
    public fullSiteFlag: Boolean;
    public siteClickFlag: Boolean;
	//public selectedTab: String;

	public groupedParams: Igroupedparameters;
	//public groupedParams: Object;


    constructor(private _mapService: MapService, private _siglService: SiglService) { }

	ngOnInit() {
		//set defaults on init
		this.showBottomBar = false;
        this.fullSiteFlag = false;
        this.siteClickFlag = false;
		//this.selectedTab = "project";
		//this.tabs.select('project');
        this.filteredProjects = [];
        
        this.icon = {
            radius: 5,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        };

        this.highlightIcon = {
            radius: 8,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.9
        };
		
		this.groupedParams = {BioArray:[], ChemArray:[], MicroBioArray:[], PhysArray:[], ToxicArray:[]};
		
		//for project info
		this._siglService.fullProject.subscribe((FP: Ifullproject) => {
			this.fullProj = FP;
			this.showBottomBar = true;
			let tabID = this.siteClickFlag ? 'site' : 'project';
			this.tabs.select(tabID);
        });
        //initial get of all geojson sites
        this._mapService.filteredSiteView.subscribe((geoj: any) => {
            this.geoj = geoj; //use this to filter later
            this.geoJsonLayer = L.geoJSON(geoj, {
                pointToLayer: ((feature, latlng) => {
                    return L.circleMarker(latlng, this.icon);
                }),
                onEachFeature: ((feature, layer) => {
                    layer.bindPopup("SiteId: " + feature.properties.site_id + ", ProjectId: " + feature.properties.project_id);
                    layer.on("click", (e) => {
                        this.onFeatureSelection(e)
                    }); 
                }) 
            }).addTo(this.map);
        });            
		this._siglService.sitePointClickBool.subscribe((val:boolean) => {
			this.siteClickFlag = val;
		})
		//for single site info.
		this._siglService.fullSite.subscribe((FS: Ifullsite) => {
			//clear GroupedParams
			this.groupedParams = {BioArray:[], ChemArray:[], MicroBioArray:[], PhysArray:[], ToxicArray:[]};
			
			this.fullSite = FS;
			this.fullSiteFlag = true;
			this.tabs.select('site');

			FS.Parameters.forEach( param => {
				switch(param.parameter_group){
					case "Biological":
						this.groupedParams.BioArray.push(param);
						console.log(this.groupedParams);
						break;
					case "Chemical":
						this.groupedParams.ChemArray.push(param);
						console.log(this.groupedParams);
						break;
					case "Microbiological":
						this.groupedParams.MicroBioArray.push(param);
						console.log(this.groupedParams);
						break;
					case "Physical":
						this.groupedParams.PhysArray.push(param);
						console.log(this.groupedParams);
						break;
					case "Toxicological":
						this.groupedParams.ToxicArray.push(param);
						console.log(this.groupedParams);
						break;
				}
			});
        });
        
        this._siglService.filteredProjects.subscribe((projects: Array<Ifilteredproject>) => {
            this.filteredProjects = projects;
        });

		this.map = L.map("map", {
			center: L.latLng(44.2, -88.01),
			zoom: 6,
			minZoom: 4,
			maxZoom: 19,
			layers: [this._mapService.baseMaps.Topo]
        });
        
        L.control.scale().addTo(this.map);
		// this._mapService.map = map;       
        //L.control.scale().addTo(this.map);
        
		this._mapService.map = this.map;

        //initial style for bottom bar
		this.style = {
			position: 'fixed',
			bottom: '0px',
			'z-index': '1001',
			display: 'flex',
			width: '100%',
			height: '150px',
			'background-color': '#f7f7f9',
			color: '#121621',
			margin: 'auto',
			left: '400px'
		}
	}//END ngOnInit

	// response from filter modal closing
	public FilterModalResponse(r) {
		let test = "what";
    }
    
	public onResizeEnd(event: ResizeEvent): void {
		this.style = {
			'z-index': '1001',
			position: 'fixed',
			left: `400px`,
			bottom: '0px',
			top: `${event.rectangle.top}px`,
			width: `${event.rectangle.width}px`,
			height: `${event.rectangle.height}px`,
			'background-color': '#f7f7f9',
			color: '#121621',
			margin: 'auto'
		};
    }
    
    public onFeatureSelection(event): void {
        
        if (this.filteredProjects.length > 0){
            //need to find site and highlight it in the sidebar project--> site list 
			console.log("fired if there are filtered projects")
			this.siteClickFlag = false;
			this._siglService.setsitePointClickBool(false);
        } else {
			console.log("fired if NO filtered projects and single site clicked");
			this.siteClickFlag = true;
			this._siglService.setsitePointClickBool(true);
			
            //there are no filtered projects, and single site was clicked
            //will need to get  full site and full project w/all sites, activate "Filter Results" slideout, populate slideout
        }
        console.log(" SITE ID: " + event.target.feature.properties.site_id + " PROJECT ID: " + event.target.feature.properties.project_id);
        this._siglService.setFullProject(event.target.feature.properties.project_id);
        this._siglService.setFullSite(event.target.feature.properties.site_id);
        this.tabs.select('site');
        //event.target.resetIcon(event.layer);
        //event.target.feature.setIcon(this.highlightIcon);
        //event.layer.bringToFront();
        //event.target.setStyle(highlightStyle);
    }

    public onFeatureMouseover(event): void {

        /* let highlightStyle = {
            radius: 8,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.9

        }
        console.log('mouseover ' + event.target.feature.properties.site_id); */
        
        
    }

}
