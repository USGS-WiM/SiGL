// ------------------------------------------------------------------------------
// ------------ groupedparameters.interface -------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a the grouped parameters used in the mapview.component for the site tab in the rezizable div

import { Iparameter } from "./parameter.interface";

export interface Igroupedparameters {
    BioArray: Array<Iparameter>;
    ChemArray:Array<Iparameter>;
    MicroBioArray:Array<Iparameter>;
    PhysArray:Array<Iparameter>;
    ToxicArray:Array<Iparameter>;
}
