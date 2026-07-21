export interface User {
    id: number;
    username: string;
    email: string;
    position: string;
    avatar_url: string;
    bio?: string;
    cover?: string;
    cover_url?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

