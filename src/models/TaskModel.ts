export interface TaskModel {
    title: string;
    description: string;
    dueDate: Date;
    start: Date;
    end: Date;
    udi: string[];
    color?: string;
    fileUrls: string[];

}