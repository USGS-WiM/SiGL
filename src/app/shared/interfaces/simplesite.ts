// ------------------------------------------------------------------------------
// ------------ simplesite.interface --------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a simplesite used in the filteredproject.interface, fullproject.interface, and sidebar.component

export interface Isimplesite {
    site_id: number;
    name: string;
    latitude: number;
    longitude: number;
    project_id: number;
    isDisplayed: boolean; // used for styling orange the sites shown in project site list
    isTempDisplayed: boolean; // used for showing rest of sites when toggled
   // nameClicked: boolean; // when name is clicked in sidebar, toggle true
}
