// ------------------------------------------------------------------------------
// ------------ datahost.interface ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a datahose used in Ifullproject interface

export interface Idatahost {
    data_host_id: number;
    description: string;
    host_name: string;
    portal_url: string;
    project_id: number;
}
