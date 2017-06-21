import { IMultiSelectOption  } from "angular-2-dropdown-multiselect";
import {Iorganization} from "./organization.interface";

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
    s_lakes?:Array<number>;
    LAKES?: Array<IMultiSelectOption>;
    s_states?:Array<string>;
    STATES?: Array<IMultiSelectOption>;
    s_monitorEffect?: Array<number>;
    MONITORS?:Array<IMultiSelectOption>;
    p_organization?: number;
    ORG?: Iorganization;
    p_objectives?: Array<number>;
    OBJS?:Array<IMultiSelectOption>;
}