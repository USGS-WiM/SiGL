// ------------------------------------------------------------------------------
// ------------ site.interface --------------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a site used in the siteview.interface, and siglService

export interface Isite {
    country: string;
    description: string;
    lake_type_id: number;
    latitude: number;
    longitude: number;
    name: string;
    project_id: number;
    site_id: number;
    start_date: Date;
    state_province: string;
    status_type_id: number;
    waterbody: string;
}
