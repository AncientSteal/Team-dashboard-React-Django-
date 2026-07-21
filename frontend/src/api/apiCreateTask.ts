import type { ServerErrorResponse, ServerSuccessCreateTaskResponse } from "../types/Api";
import { API_BASE_URL } from "../config";

export const createTaskRequest = async ( title: string, description: string, deadline: string, status: string, token:string): Promise<ServerErrorResponse | ServerSuccessCreateTaskResponse> => {
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, status, deadline }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { status: 'error', message: errorData.error || 'Failed to create task'};
        }

        return await response.json();
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('Server is not responding. Please try again later.', { cause: error })
            }
            throw error;
        }
        throw new Error('An unexpected error occurred', { cause: error });

    } finally {
        clearTimeout(timeout);
    }
}