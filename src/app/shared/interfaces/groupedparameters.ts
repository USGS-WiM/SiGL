import { Iparameter } from "./parameter.interface";


export interface Igroupedparameters {

    BioArray: Array<Iparameter>;
    ChemArray:Array<Iparameter>;
    MicroBioArray:Array<Iparameter>;
    PhysArray:Array<Iparameter>;
    ToxicArray:Array<Iparameter>;
}
