// ------------------------------------------------------------------------------
// ------------ chosenFilters.interface -----------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for Filters chosen in Sidebar

import { IMultiSelectOption } from "angular-2-dropdown-multiselect";
import { Iorganization } from "./organization.interface";
import { Isimpleproject } from "app/shared/interfaces/simpleproject.interface";

export interface IchosenFilters {
    s_parameters?: Array<number>;
    PARAMETERS?: Array<IMultiSelectOption>;
    s_projDuration?: Array<number>;
    DURATIONS?: Array<IMultiSelectOption>;
    s_projStatus?: Array<number>;
    STATUSES?: Array<IMultiSelectOption>;
    s_resources?: Array<number>;
    RESOURCES?: Array<IMultiSelectOption>;
    s_media?: Array<number>;
    MEDIA?: Array<IMultiSelectOption>;
    s_lakes?: Array<number>;
    LAKES?: Array<IMultiSelectOption>;
    s_states?: Array<string>;
    STATES?: Array<IMultiSelectOption>;
    s_monitorEffect?: Array<number>;
    MONITORS?: Array<IMultiSelectOption>;
    p_organization?: Array<number>;
    ORG?: Array<IMultiSelectOption>;
    p_objectives?: Array<number>;
    OBJS?: Array<IMultiSelectOption>;
    ProjectName?: Isimpleproject;
    p_project?: Array<number>;
    PROJ?: Array<IMultiSelectOption>;
}
