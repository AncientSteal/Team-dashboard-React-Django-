import type { Task } from "./Tasks";

export interface ModalProps {
    isModalOpen: boolean,
    onClose: () => void;
}

export interface TaskModalProps extends ModalProps {
    onTaskCreated: (newTask: Task) => void;
}

export interface TaskUpdateModalProps extends ModalProps {
    task: Task | null;
    onTaskUpdated: (updatedTask: Task) => void;
    onTaskDeleted: (task_id: string | number) => void;
}