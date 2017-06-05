// import {LatLngBounds} from "leaflet";
import { ILatLng } from "app/shared/latlong.interface";

export class Location implements ILatLng {
    latitude: number;
    longitude: number;
    address: string;
  //  viewBounds: LatLngBounds;
}
