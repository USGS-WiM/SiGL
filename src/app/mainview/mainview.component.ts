import { Component, OnInit } from '@angular/core';
import { MapService } from "app/shared/map.service";

@Component({
  selector: 'mainview',
  template: `<div id="map"></div>`,
  styleUrls: ['./mainview.component.css']
})
export class MainviewComponent implements OnInit {
  public map: any;
  constructor( private _mapService: MapService) { }

  ngOnInit() {
      this.map = L.map("map", {
            center: L.latLng(40.731253, -73.996139),
            zoom: 5,
            minZoom: 4,
            maxZoom: 19,
            layers: [this._mapService.baseMaps.Topo]
      });
      L.control.layers(this._mapService.baseMaps).addTo(this.map);
      L.control.scale().addTo(this.map);
     // this._mapService.map = map;       
      L.control.scale().addTo(this.map);

      this._mapService.map = this.map; 
  }

}
