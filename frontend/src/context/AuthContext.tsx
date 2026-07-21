import { createContext, useEffect, useState, type ReactNode } from "react";
import type { User, AuthContextType } from "../types/Auth";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('user_token'));
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user_info');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('user_token', newToken);
        localStorage.setItem('user_info', JSON.stringify(newUser));
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
    };

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    localStorage.setItem('user_info', JSON.stringify(userData));
                } else {
                    logout();
                } 
            } catch (error) {
                console.log("Ошибка проверки авторизации", error);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();

    }, [token]);

    return (
        <AuthContext.Provider value={{user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}