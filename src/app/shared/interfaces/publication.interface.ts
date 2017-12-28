// ------------------------------------------------------------------------------
// ------------ publication.interface -------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a publication used in the fullproject.interface

export interface Ipublication {
    publication_id: number;
    description: string;
    science_base_id: string;
    title: string;
    url: string;
}