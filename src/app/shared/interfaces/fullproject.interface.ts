import {Iresource} from "./resource.interface";
import {Iobjective} from "./objective.interface";
import {ImonitorEffort} from "./monitoreffort.interface";
import {Ikeyword} from "./keyword.interface";
import {Idatahost} from "./datahost.interface";
import {Iorganizationresource} from "./organizationresource.interface";
import {Icontactresource} from "./contactresource.interface";
import {Ipublication} from "./publication.interface";
import { Isimplesite } from "app/shared/interfaces/simplesite";

export interface Ifullproject {
    ProjectId: number;
    ScienceBaseId: string;
    Name: string;
    StartDate: Date;
    EndDate: Date;
    DataManagerId: number;
    status_id: number;
    Status: string;
    duration_id: number;
    Duration: string;
    Description: string;
    AdditionalInfo: string;
    Objectives: Array<Iobjective>;
    MonitoringCoords: Array<ImonitorEffort>;    
    Keywords: Array<Ikeyword>;
    ProjectWebsite: string;
    ProjectURLs: Array<string>;
    DataHosts: Array<Idatahost>;
    Organizations: Array<Iorganizationresource>;
    Contacts: Array<Icontactresource>;
    Publications: Array<Ipublication>;
    created_stamp: Date;
    last_edited_stamp: Date;
    projectSites?: Array<Isimplesite>;
    isCollapsed?:boolean;
}
