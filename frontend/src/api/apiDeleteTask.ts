import { API_BASE_URL } from "../config";
import type { ServerErrorResponse, ServerSuccessDeleteTaskResponse } from "../types/Api";

export const taskDeleteRequest = async ( 
    task_id: string | number,
    token: string,
): Promise<ServerErrorResponse | ServerSuccessDeleteTaskResponse> => {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const response = await fetch(`${API_BASE_URL}/api/tasks/delete/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task_id }),
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

        return await response.json();

    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return {status: 'error', message: 'Server is not responding. Please try again later.'};
            }
            return{status: 'error', message: error.message};
        }
        return { status: 'error', message: 'An unexpected error occurred' };;

    } finally {
        clearTimeout(timeout);
    }
}