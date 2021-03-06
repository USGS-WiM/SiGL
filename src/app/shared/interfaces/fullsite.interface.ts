// ------------------------------------------------------------------------------
// ------------ fullsite.interface ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a full site used in the mapview.component,and siglService

import { Iresource } from "./resource.interface";
import { Imedia } from "./media.interface";
import { Ifrequency } from "./frequency.interface";
import { Iparameter } from "./parameter.interface";

export interface Ifullsite {
    SiteId: number;
    Name: string;
    latitude: number;
    longitude: number;
    State: string;
    Country: string;
    lake_type_id: number;
    Lake: string;
    Waterbody: string;
    Watershed: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    status_type_id: number;
    Status: string;
    SamplePlatform: string;
    AdditionalInfo: string;
    url: string;
    Resources: Array<Iresource>;
    Media: Array<Imedia>;
    Frequencies: Array<Ifrequency>;
    Parameters: Array<Iparameter>;
}
