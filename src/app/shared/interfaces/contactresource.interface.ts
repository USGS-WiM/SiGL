// ------------------------------------------------------------------------------
// ------------ contactresource.interface ---------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a contact used in Ifullproject interface

export interface Icontactresource {
    contact_id: number;
    science_base_id: string;
    name: string;
    email: string;
    phone: string;
    ContactOrgName: string;
}
