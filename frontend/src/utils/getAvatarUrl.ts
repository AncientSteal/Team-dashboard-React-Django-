import { API_BASE_URL } from "../config";

export function getAvatarUrl(avatarPath: string | null | undefined): string {
    if (!avatarPath) {
        return '/default-avatar.png'
    }

    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath;
    }

    return `${API_BASE_URL}${avatarPath}`;
}