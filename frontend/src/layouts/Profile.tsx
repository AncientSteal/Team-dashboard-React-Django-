import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import ProfileEditModal from "../modals/ProfileEditModal";

function ProfilePage() {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const profile_avatar = getAvatarUrl(user?.avatar_url);
    const profile_cover = getAvatarUrl(user?.cover_url);

    return (
        <div className="flex flex-col gap-4 mx-auto max-w-[80%] my-12">
            <div className="flex justify-between items-center">
                <p className="text-dark-700 font-bold text-2xl">Profile</p>
                <span className="text-gray-300 font-medium text-base">Dashboard / Profile</span>
                <button onClick={() => setIsEditModalOpen(true)} className="bg-brand-200 hover:bg-brand-100 text-base-white font-medium px-4 py-2 rounded-none transition transform active:scale-95 cursor-pointer">
                    Edit Profile
                </button>
            </div>
            <div className="relative">
                <div>
                    <div className="z-0 h-65 w-full overflow-hidden bg-black">
                        {(user?.cover_url || user?.cover) && (
                            <img className="w-full h-full object-cover" src={profile_cover} alt="profile_cover" />
                        )}
                    </div>
                    <div className="bg-base-gray w-full h-full -z-1"></div>
                </div>
                <div className="absolute z-2 flex flex-col gap-4 top-43 justify-center w-full items-center font-medium">
                    <div className="rounded-full w-44 h-44 backdrop-blur-xl flex items-center justify-center">
                        <div className="rounded-full w-40 h-40 overflow-hidden">
                            <img className="object-cover w-full h-full" src={profile_avatar} alt="user_avatar" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-dark-700 text-2xl">{user?.username || 'Guest'}</p>
                        <span className="text-gray-300  text-base">{user?.position || 'Worker'}</span>
                    </div>
                    
                    <div className="flex flex-col gap-5 text-center">
                        <p className="text-dark-700 text-base">About me</p>
                        <p className="text-gray-400 text-sm">
                            {user?.bio || 'No bio provided yet. Click "Edit Profile" to add some information about yourself!'}
                        </p>
                    </div>
                    <div>
                        <p className="text-dark-700">Follow me on</p>
                    </div>
                </div>
            </div>
            <ProfileEditModal 
                isModalOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    )
}

export default ProfilePage;

/* <div className="flex border text-dark-700 text-base">
    <div className="flex gap-1 px-4 py-2 border-r items-center">
        <p>259</p>
        <span className="text-gray-300 text-sm">Posts</span>
    </div>
    <div className="flex gap-1 px-4 py-2 border-r items-center">
        <p>129K</p>
        <span className="text-gray-300 text-sm">Followers</span>
    </div>
    <div className="flex gap-1 px-4 py-2 items-center">
        <p>2K</p>
        <span className="text-gray-300 text-sm">Followers</span>
    </div>
</div> элемент с данными пользователя находится в разработке*/