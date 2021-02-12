// ------------------------------------------------------------------------------
// ------------ objective.interface ---------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for an objective type used in the filter.component, fullproject.interface, and siglService

export interface Iobjective {
    objective: string;
    objective_type_id: number;
}
