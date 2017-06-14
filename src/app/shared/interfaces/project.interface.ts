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