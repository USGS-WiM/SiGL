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

declare var OverlappingMarkerSpiderfier: any;

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
	public tempSitesIcon: any;
	public highlightIcon: any;
	public geoJsonLayer: L.GeoJSON;
	public tempGeoJsonLayer: L.GeoJSON;
	public selectedProjGeoJsonLayer: L.GeoJSON;
	private geoj: any;
	private tempGeoj: any;
	public popup: any;
	public style: Object = {};
	public fullProj: Ifullproject;
	public fullProjSites: Array<Ifullsite>;
	public filteredProjects: Array<Ifilteredproject>;
	public fullSite: Ifullsite;
	public showBottomBar: Boolean;
	public fullSiteFlag: Boolean;
	public siteClickFlag: Boolean;
	private AllShowingProjIDArray: Array<number>;
	private clickedMarker: any;
	public groupedParams: Igroupedparameters;
    //public groupedParams: Object;
    
    public markerIcon: any;
    public oms: any;


	constructor(private _mapService: MapService, private _siglService: SiglService) { }

	ngOnInit() {
		this.AllShowingProjIDArray = [];
		//set defaults on init
		this.showBottomBar = false;
        this.fullSiteFlag = false;
        this.siteClickFlag = false;
        this.filteredProjects = [];

        //this.markerIcon = L.divIcon({className: 'sigldivicon'});
        this.markerIcon = L.divIcon({
            iconSize: new L.Point(10, 10)
        });

        this.tempSitesIcon = {
            radius: 4,
            fillColor: "#6d7175",
            color: "#000",
            weight: 0,
            opacity: 1,
            fillOpacity: 0.5
        };
        this.highlightIcon = {
            radius: 8,
            weight: 5,
            opacity: 0.2,
            fill: 'Orange',
            color: 'orange',
            fillColor: 'orange',
            fillOpacity: 0.5,
            pane: "mainSiglLayer"
        };
		
		this.groupedParams = {BioArray:[], ChemArray:[], MicroBioArray:[], PhysArray:[], ToxicArray:[]};
		
		//for knowing which projects are showing all their sites on the map
		this._mapService.allShowingProjectIds.subscribe((projIds: Array<number>) => {
			this.AllShowingProjIDArray = projIds;
		})
		//for project info
		this._siglService.fullProject.subscribe((FP: Ifullproject) => {			
            this.fullProj = FP;
            if (this.siteClickFlag == false){
                if (this.clickedMarker){
                    this.map.closePopup();
                }
                this.highlightProjSites(this.fullProj.ProjectId);
            }
			this.showBottomBar = true;
			let tabID = this.siteClickFlag ? 'site' : 'project';
			this.tabs.select(tabID);
		});
		//every time geojson gets updated (initially its all, after depends on filters chosen)
		this._mapService.filteredSiteView.subscribe((geoj: any) => {
			if (geoj !== "") {
				if (this.selectedProjGeoJsonLayer) this.selectedProjGeoJsonLayer.remove();
				if (this.geoJsonLayer) this.geoJsonLayer.remove();

				this.geoj = geoj; //use this to filter later
				this.geoJsonLayer = L.geoJSON(geoj, {
					pointToLayer: ((feature, latlng) => {
						return L.marker(latlng, {icon: new L.DivIcon({className: this.setMarker(feature), iconSize: [10,10]})});
					}),
					onEachFeature: ((feature, layer) => {
                        test.addMarker(layer);
                        layer.bindPopup("SiteId: " + feature.properties.site_id + ", ProjectId: " + feature.properties.project_id);
                        layer.on('popupclose', (e) => {
                            if (this.clickedMarker){
								this.clickedMarker.setStyle(this.setMarker(e.target.feature));
							}
                            this.clickedMarker = e.target;
                            e.target.setStyle(this.setMarker(e.target.feature));
                        });
                        //changed from on 'click' to on 'popupopen' to test
						layer.on("click", (e) => {
							if (this.clickedMarker) {
								this.clickedMarker.setStyle(this.setMarker(e.target.feature));
							}
							this.clickedMarker = e.target;
                            e.target.setStyle(this.highlightIcon);
							this.onFeatureSelection(e)
						}); 
					})
				}).addTo(this.map);
			}
		});
		//temporary sites when user clicks toggle between show all and only filteres sites from sidebar
		this._mapService.tempSites.subscribe((tempGeoj: any) => {
			if (tempGeoj !== "") {
				if (this.selectedProjGeoJsonLayer) this.selectedProjGeoJsonLayer.remove();
				if (this.tempGeoJsonLayer) this.tempGeoJsonLayer.remove();

				this.tempGeoj = tempGeoj; //use this to filter later
				this.tempGeoJsonLayer = L.geoJSON(tempGeoj, {
                    pane: "subSiglLayer",
					pointToLayer: ((feature, latlng) => {
						return L.circleMarker(latlng, this.tempSitesIcon);
					}),
					onEachFeature: ((feature, layer) => {
						layer.bindPopup("SiteId: " + feature.properties.site_id + ", ProjectId: " + feature.properties.project_id);
						layer.on("click", (e) => {
							this.onFeatureSelection(e)
						});
					})
				}).addTo(this.map);
			}
		});
		this._siglService.sitePointClickBool.subscribe((val: boolean) => {
			this.siteClickFlag = val;
		})
		//for single site info.
		this._siglService.fullSite.subscribe((FS: Ifullsite) => {
			//clear GroupedParams
			this.groupedParams = { BioArray: [], ChemArray: [], MicroBioArray: [], PhysArray: [], ToxicArray: [] };

			this.fullSite = FS;
			this.fullSiteFlag = true;
			this.tabs.select('site');

			FS.Parameters.forEach(param => {
				switch (param.parameter_group) {
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
        this._siglService.sitePointClickBool.subscribe((val: boolean) => {
            this.siteClickFlag = val;
        })
        //for single site info.
        this._siglService.fullSite.subscribe((FS: Ifullsite) => {
            //clear GroupedParams
            this.groupedParams = { BioArray: [], ChemArray: [], MicroBioArray: [], PhysArray: [], ToxicArray: [] };

            this.fullSite = FS;
            this.fullSiteFlag = true;
            this.tabs.select('site');

            FS.Parameters.forEach(param => {
                switch (param.parameter_group) {
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

        let test = new OverlappingMarkerSpiderfier(this.map, {keepSpiderfied:true});
        this.map.createPane('mainSiglLayer');
        this.map.getPane('mainSiglLayer').style.zIndex = 1000;

        this.map.createPane('subSiglLayer');
        this.map.getPane('subSiglLayer').style.zIndex = 1;

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
        //remove any highlighted projects before highighting clicked site.
        if (this.selectedProjGeoJsonLayer) this.selectedProjGeoJsonLayer.remove();

        if (this.filteredProjects.length > 0) {
            console.log("fired if there are filtered projects")
            //need to find site and highlight it in the sidebar project--> site list 
            
            
            this.siteClickFlag = true;
            this._siglService.setsitePointClickBool(true);
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

	//project name was selected from sidebar. add highlight marker to all sites belonging to this project
	public highlightProjSites(projId) {
		if (this.selectedProjGeoJsonLayer) this.selectedProjGeoJsonLayer.remove();
		let highlightedProjSites = []; let geoJholder: any;

		if (this.AllShowingProjIDArray.indexOf(projId) > -1) {
			geoJholder = this.tempGeoj;
		} else {
			geoJholder = this.geoj;
		}
		// now add to map as highlighted thing
		if (Array.isArray(geoJholder)) {

			geoJholder.forEach(feature => {
				if (feature.properties.project_id == projId) {
					highlightedProjSites.push(feature);
				}
			});
		} else {
			geoJholder.features.forEach(feature => {
				if (feature.properties.project_id == projId) {
					highlightedProjSites.push(feature);
				}
			});
		}

		this.selectedProjGeoJsonLayer = L.geoJSON(<any>highlightedProjSites, {
			pointToLayer: ((feature, latlng) => {
				return L.circleMarker(latlng, this.highlightIcon);
			}),
			onEachFeature: ((feature, layer) => {
				layer.bindPopup("SiteId: " + feature.properties.site_id + ", ProjectId: " + feature.properties.project_id);
				layer.on("click", (e) => {
					this.onFeatureSelection(e)
				});
			})
		}).addTo(this.map);

	}
	//select fillcolor for leaflet circleMakers
	/* public setMarker(feature) {
		let fillColor = "";
		switch (feature.properties.lake_type_id) {
			case 1:
				//Erie
				fillColor = "#B6BB44";
				break;
			case 2:
				//Huron
				fillColor = "#8A3133";
				break;
			case 3:
				//Michigan
				fillColor = "#927F56";
				break;
			case 4:
				//Ontario
				fillColor = "#6A318F";
				break;
			case 5:
				//Superior
				fillColor = "#349074";
				break;
		}
		return {
			radius: 3,
			fillColor: fillColor,
			color: "#000",
			weight: 0,
			opacity: 1,
			fillOpacity: 0.5
        } 
    } */
    
    public setMarker(feature) {
		let className = "";
		switch (feature.properties.lake_type_id) {
			case 1:
				//Erie
                //return L.divIcon({className:'erieDivicon'});
                return 'erieDivicon';
			case 2:
				//Huron
                //return L.divIcon({className:'huronDivicon'});
                return 'huronDivicon';
			case 3:
				//Michigan
                //return L.divIcon({className:'michiganDivicon'});
                return 'michiganDivicon';
			case 4:
				//Ontario
                //return L.divIcon({className:'ontarioDivicon'});
                return 'ontarioDivicon';
			case 5:
				//Superior
                //return L.divIcon({className:'superiorDivicon'});
                return 'superiorDivicon';
            default:
                //return L.divIcon({className: 'otherLakeDivicon'});
                return 'otherLakeDivicon';
        }
	}

}
