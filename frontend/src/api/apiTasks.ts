import { API_BASE_URL } from "../config";
import type { ServerErrorResponse, ServerSuccessTaskResponse } from "../types/Api";

export const tasksRequest = async (token: string): Promise<ServerErrorResponse | ServerSuccessTaskResponse> => {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorResponse: ServerErrorResponse = {
                status: 'error',
                message: errorData.error || `Server error: ${response.status}`
            };
            return errorResponse;
        }

        const result = await response.json();
        const successResponse: ServerSuccessTaskResponse = {
            status: 'success',
            tasks: result.tasks.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                created_at: task.created_at,
                updated_at: task.updated_at || 'No update',
                deadline: task.deadline || null,
                assigned_to: task.assigned_to,
            }))
        };

        return successResponse;

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