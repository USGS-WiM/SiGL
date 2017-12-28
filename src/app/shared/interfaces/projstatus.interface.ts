// ------------------------------------------------------------------------------
// ------------ projstatus.interface --------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a project status used in the filter.component, and siglService

export interface IprojStatus {
    status_value: string;
    proj_status_id: number;
}