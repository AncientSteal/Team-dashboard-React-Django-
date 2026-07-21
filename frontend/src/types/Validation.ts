export interface ValidationRules {
    login: (value: string) => string | null;
    password: (value: string) => string | null;
    password_repeat: (value: string, originalPassword: string) => string | null;
    email: (value: string) => string | null;
    number: (value: string ) => string | null;
    position: (value: string) => string | null;
    avatar_url: (value: string) => string | null;
    bio: (value: string) => string | null;
    cover: (value: string) => string | null;
    deadline?: (value: string) => string | null;
    taskStatus?: (value: string) => string | null;
    task_description?: (value: string) => string | null;
    task_title?: (value: string) => string | null;
}

export interface FormValidationProps {
    login?: string;
    password?: string;
    password_repeat?: string;
    email?: string;
    number?: string;
    position?: string;
    avatar_url?: string;
    bio?: string;
    cover?: string;
    deadline?: string;
    taskStatus?: string;
    task_title?: string;
    task_description?: string;
}