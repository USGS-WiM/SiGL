// ------------------------------------------------------------------------------
// ------------ basemaps.component ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     The basemaps component is a selector component that contains the basemap layers.

import { Component, OnInit } from '@angular/core';
import { MapService } from "../../shared/services/map.service";

declare let gtag: Function;

@Component({
  selector: 'basemaps',
  templateUrl: './basemaps.component.html',
  styleUrls: ['./basemaps.component.css']
})
export class BasemapsComponent implements OnInit {
  public baseLayers: any;
  public chosenBaseLayer: string;

  constructor(private _mapService: MapService) { }

  ngOnInit() {
    this.baseLayers = this._mapService.baseMaps;
    this.chosenBaseLayer = 'Topo';
  }

  public toggleLayer(newVal: string){
    this.chosenBaseLayer = newVal;
    this._mapService.map.removeLayer(this._mapService.baseMaps["OpenStreetMap"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Topo"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Terrain"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Satellite"]);
    this._mapService.map.removeLayer(this._mapService.baseMaps["Gray"]);

    
    
    // now add the one they want
    this._mapService.map.addLayer(this._mapService.baseMaps[newVal]);

    gtag('event', 'click', {'event_category': 'Basemaps','event_label': 'basemap: ' + newVal});
  }

}
