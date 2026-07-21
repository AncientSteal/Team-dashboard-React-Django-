export interface Task {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'in_progress' | 'done';
    created_at: string;
    updated_at: string | null;
    deadline: string | null;
    assigned_to: {
        id: number;
        name: string;
        email: string;
    };
}

export interface KanbanCardProps extends Task {
    onEditClick: (task: Task) => void;
}