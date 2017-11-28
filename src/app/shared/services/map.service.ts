import { Injectable } from '@angular/core';
import { Map, geoJSON } from 'leaflet'
import * as L from 'leaflet';

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CONFIG } from "./config";
import { Http, Response } from '@angular/http';
import { IchosenFilters } from 'app/shared/interfaces/chosenFilters.interface';


@Injectable()
export class MapService {
    
    private _allSiteView: any;
    public map: Map;
    public baseMaps: any;
    public filtersPassed: IchosenFilters;
    private newFilteredGeoJson: L.GeoJSON;
    private newFilteredGeoJsonArray: Array<any>;

    constructor(private _http: Http) {
        this.baseMaps = {// {s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png  
            OpenStreetMap: L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
                maxZoom: 20,
                attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Topo: L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
                attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
            }),
            CartoDB: L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
                attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> &copy; <a href='http://cartodb.com/attributions'>CartoDB</a>"
            }),
            Satellite: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'//,
                //maxZoom: 10
            }),
            Terrain: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
                maxZoom: 13
            }),
            Gray: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
                maxZoom: 16
            })
        };

        this.httpRequest();
        
    }
    
    //subject
    private _allSiteViewSubject: Subject<any> = new Subject<any>();
    private _filteredSiteViewSubject: BehaviorSubject<any> = <BehaviorSubject<any>>new BehaviorSubject("");

    //initial set of all geojson sites. keep for resetting
    public set AllSiteView(geoJson: any) {
        this._allSiteView = geoJSON;
    }

    // clear filters and give back all
    public get AllSiteView(): any {
        return this._allSiteView;
    }

    // setter for filtered geojson sites based on filters chosen
    public setFilteredSiteView(geoJson: any) {
        this._filteredSiteViewSubject.next(geoJson);
    }

    // mainview subscribed to this for filtered sites
    public get filteredSiteView(): Observable<any> {
        return this._filteredSiteViewSubject.asObservable();
    }

    public updateFilteredSites(filters: IchosenFilters){
        this.newFilteredGeoJsonArray = [];
        this.newFilteredGeoJson = new L.GeoJSON();
        this.filtersPassed = filters;
        let isPresent = false;
        this._filteredSiteViewSubject.getValue().features.forEach(feature => {            
            isPresent = false;
            let parameterArray = feature.properties.parameter_type_id ? feature.properties.parameter_type_id.split(",") : [];
            let projDurationArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let projStatusArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let resArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let mediaArray = feature.properties.media_type_id ? feature.properties.media_type_id.split(",") : [];
            let lakeArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let stateArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let monArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];
            let org;
            let objectiveArray = feature.properties.proj_duration_id ? feature.properties.proj_duration_id.split(",") : [];

            // loop through to find if filters are in geojson
            for (let p of this.filtersPassed.s_parameters) {
                if (parameterArray.includes(p.toString())){
                    isPresent= true;
                    break;
                }
            }
/*            for (let p of this.filtersPassed.s_projDuration) {
                if (projDurationArray.includes(p.toString())){
                    isPresent= true;
                    break;
                }
            } // finish all loops
*/
            if (isPresent) {
                this.newFilteredGeoJsonArray.push(feature);
            }
        }, this);
        let test = "hi";
        // set the filteredSiteView to be the new geojson
        //this.newFilteredGeoJson.addData(this.newFilteredGeoJsonArray);
        this.setFilteredSiteView(this.newFilteredGeoJsonArray);
        
    }
    //initial http get of all geojson sites
    private httpRequest(): void {
        this._http.get(CONFIG.SITE_URL + "/GetSiteView.geojson")
            .map(res => <any>res.json())
            .subscribe(geoj => {
                this.AllSiteView = geoj;
                this.setFilteredSiteView(geoj);
            }, error => this.handleError);
    }

    //Error Handler
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server Error");
    }
}
