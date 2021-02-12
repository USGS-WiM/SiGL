// ------------------------------------------------------------------------------
// ------------ organizationresource.interface ----------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for an organization resource used in the fullproject.interface

export interface Iorganizationresource {
    organization_system_id: number;
    org_id: number;
    OrganizationName: string;
    div_id: number;
    DivisionName: string;
    sec_id: number;
    SectionName: string;
    science_base_id: string;
}
