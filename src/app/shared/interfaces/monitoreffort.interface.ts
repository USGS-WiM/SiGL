// ------------------------------------------------------------------------------
// ------------ monitoreffort.interface -----------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a monitoring coordination effort used in the filter.component, fullproject.interface, and siglService

export interface ImonitorEffort {
    effort: string;
    monitoring_coordination_id: number;
}
