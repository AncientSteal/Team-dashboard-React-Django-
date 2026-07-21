import type { User } from "./Auth";
import type { Task } from "./Tasks";

export interface ServerErrorResponse {
    status: 'error';
    message: string;
}

export interface ServerSuccessResponse {
    status: 'success';
    token: string;
    user: User;
}

export interface ServerSuccessTaskResponse {
    status: 'success';
    tasks: Task[];
}

export interface ServerSuccessCreateTaskResponse {
    status: 'success';
    task: Task;
}

export interface ServerSuccessDeleteTaskResponse {
    status: 'success';
    deleted_id: number | string;
}