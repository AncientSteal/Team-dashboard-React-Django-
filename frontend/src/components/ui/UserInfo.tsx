import { ArrowIco } from "./Icons";
import { useAuth } from "../../hooks/useAuth";
import { getAvatarUrl } from "../../utils/getAvatarUrl";

export function UserInfo() {
    const { user } = useAuth();
    return (
        <div className="flex">
            <div className="flex flex-col text-right h-full items-end justify-center">
                <p className="text-dark-700 font-medium text-sm">{user?.username}</p>
                <span className="text-dark-300 font-medium text-xs">{user?.position}</span>
            </div>
            <div className="w-11.5 h-11.5 ml-3">
                <img className="object-cover w-full h-full rounded-full" src={getAvatarUrl(user?.avatar_url)} alt="UserAvatar" />
            </div>
            <button className="text-stroke-gray-300 h-full items-center">
                <ArrowIco />
            </button>
        </div>
    )
}