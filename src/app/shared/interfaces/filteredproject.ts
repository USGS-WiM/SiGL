// ------------------------------------------------------------------------------
// ------------ filteredproject.interface ---------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a filtered project. Used in the Mapview and sidebar components, and in siglService

import { Isimplesite } from "app/shared/interfaces/simplesite";

export interface Ifilteredproject {
    name: string;
    project_id: number;
    projectSites: Array<Isimplesite>;
    isCollapsed?: boolean;
    filteredSiteCount: number;
}
