import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface TaskModel {
    id?: string;
    title: string;
    description: string;
    dueDate?: FirebaseFirestoreTypes.Timestamp;
    start?: FirebaseFirestoreTypes.Timestamp;
    end?: FirebaseFirestoreTypes.Timestamp;
    uids: string[];
    color?: string;
    attachments: Attachment[];
    progress?: number;
    isUrgent: boolean;
    createdAt?: FirebaseFirestoreTypes.Timestamp;

}

export interface Attachment {
    name: string,
    url: string,
    size: number,
    type?: string
}

export interface SubTask {
    createAt: number
    description: string
    id: string
    taskId: string
    updatedAt: number
    title: string,
    isCompleted: boolean
}
