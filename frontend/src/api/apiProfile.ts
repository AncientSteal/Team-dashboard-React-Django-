import { API_BASE_URL } from "../config";
import type { ServerSuccessResponse, ServerErrorResponse } from "../types/Api";

export const updateProfileRequest = async (formData: FormData, token: string ): Promise<ServerErrorResponse | ServerSuccessResponse> => {
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000)
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/update/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorResponse: ServerErrorResponse = {
                status: 'error',
                message: errorData.error || `Server error: ${response.status}`
            }
            return errorResponse;
        }

        const result = await response.json();
        const successResponse: ServerSuccessResponse = {
            status: 'success',
            token: token,
            user: {
                id: result.user.id,
                username: result.user.username || 'Guest',
                email: result.user.email || 'user@example.com',
                position: result.user.position || 'worker',
                avatar_url: result.user.avatar_url || '',
                bio: result.user.bio || '',
                cover_url: result.user.cover || '',
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
};