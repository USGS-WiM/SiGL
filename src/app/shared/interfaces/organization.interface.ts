// ------------------------------------------------------------------------------
// ------------ organization.interface ------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for an organization used in the filter.component, chosenfilters.interface, 
//              fullproject.interface, organizationresource.interface, and siglService

export interface Iorganization {
     organization_id: number;
     organization_name: string;
}