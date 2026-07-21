import { API_BASE_URL } from "../config";
import type { ServerErrorResponse, ServerSuccessResponse } from "../types/Api";

export const loginRequest = async(username: string, password: string): Promise<ServerSuccessResponse | ServerErrorResponse> => {

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
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
        const successResponse:ServerSuccessResponse = {
            status: 'success',
            token: result.token,
            user: {
                id: result.user.id,
                username: result.user.username || 'Guest',
                email: result.user.email || 'user@example.com',
                position: result.user.position || 'worker',
                avatar_url: result.user.avatar_url || '',
            }
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