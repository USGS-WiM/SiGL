// ------------------------------------------------------------------------------
// ------------ parameter.interface ---------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a parameter used in the mapview.component, filter.component,
//              fullsite.interface, groupedparameters.interface, parameter.interface, and siglService

export interface Iparameter {
    parameter: string;
    parameter_group: string;
    parameter_type_id: number;
}
