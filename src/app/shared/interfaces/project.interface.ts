// ------------------------------------------------------------------------------
// ------------ project.interface -----------------------------------------------
// ------------------------------------------------------------------------------
// copyright:   2017 WiM - USGS
// authors:     Tonia Roddick USGS Web Informatics and Mapping
//              Erik Myers USGS Web Informatics and Mapping
// purpose:     Interface for a project used in the filter.component, and siglService

export interface Iproject {
    project_id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    url: string;
    additional_info: string;
    data_manager_id: number;
    science_base_id: string;
    description: string;
    proj_status_id: number;
    proj_duration_id: number;
    ready_flag: number;
    created_stamp: Date;
    last_edited_stamp: Date;
}
