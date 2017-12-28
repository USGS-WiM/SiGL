// ------------------------------------------------------------------------------
// ------------ resourse.interface ----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a resource type used in the filter.component, fullproject.interface, fullsite.interface, and siglService

export interface Iresource {
    resource_name: string;
    resource_type_id: number;
}