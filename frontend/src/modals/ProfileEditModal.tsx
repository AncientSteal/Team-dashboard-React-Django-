import { useRef } from "react";
import { updateProfileRequest } from "../api/apiProfile";
import { FormInput } from "../components/form/FormInput";
import ButtonSpin from "../components/ui/ButtonSpin";
import { formValidation } from "../features/Validation";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { ModalProps } from "../types/Modal";

function ProfileEditModal({ isModalOpen, onClose }: ModalProps) {
    const { token, user, login: updateContext } = useAuth();
    const avatarRef = useRef<HTMLInputElement>(null);
    const coverRef = useRef<HTMLInputElement>(null);

    const { formData, errors, setErrors, buttonIsLoading, setBtnIsLoading, handleChange, handleSubmit } = useForm({
            initialValues: { 
                login: user?.username || '', 
                position: user?.position ||  '', 
                avatar_url: '', 
                cover: '', 
                bio: user?.bio ||  '' },
            validate: formValidation,
            onSubmit: async (values) => {
                if (!token) {
                    setErrors({ login: 'Authentication token is missing. Please re-login.' });
                    return;
                } 
                try {

                    const dataToSend = new FormData();
                    dataToSend.append('username', values.login);
                    dataToSend.append('position', values.position);
                    dataToSend.append('bio', values.bio);
                    if (avatarRef.current?.files?.[0]) {
                        dataToSend.append('avatar_url', avatarRef.current.files[0])
                    }
                    if (coverRef.current?.files?.[0]) {
                        dataToSend.append('cover', coverRef.current.files[0])
                    }

                    const result = await updateProfileRequest(dataToSend, token);
                    if (result && result.status === 'error') {
                        setErrors({ login: result.message });
                        console.log('Please fix the errors in the form');
                    } else if (result && result.status === 'success') {
                        console.log('Profile updated', result.token);
                        updateContext(result.token, result.user);
                        onClose();
                    }
                } catch (serverError: unknown) {
                    if (serverError instanceof Error) {
                        setErrors({ login: 'Failed to edit profile.' })
                    } else {
                        setErrors({ login: 'Something went wrong. Please try again.' })
                    }
                } finally {
                    setBtnIsLoading(false);
                }
            }
        });

        return (
            <>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-gray-200 rounded-2xl p-3 md:p-6 w-fit shadow-2xl flex flex-col gap-4 text-sm">
                            <h3 className="text-xl font-bold text-dark-700">Edit Profile Info</h3>
                            <form onSubmit={handleSubmit} id="login-form" className="text-sm text-dark-700 font-medium w-full lg:w-[30vw] md:w-[60vw] flex flex-col gap-2" action="" noValidate>
                                <FormInput 
                                    label="Username"
                                    name="login"
                                    type="text"
                                    placeholder="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    error={errors.login}
                                />
                                <FormInput 
                                    label="Position"
                                    name="position"
                                    type="text"
                                    placeholder="Worker"
                                    value={formData.position}
                                    onChange={handleChange}
                                    error={errors.position}
                                />
                                <FormInput 
                                    label="About Me"
                                    name="bio"
                                    type="text"
                                    placeholder="Description of my skillz"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    error={errors.bio}
                                />
                                <FormInput 
                                    label="Avatar Image"
                                    name="avatar_url"
                                    type="file"
                                    placeholder=""
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    error={errors.avatar_url}
                                    ref={avatarRef}
                                />
                                <FormInput 
                                    label="Cover Image"
                                    name="cover"
                                    type="file"
                                    placeholder=""
                                    value={formData.cover}
                                    onChange={handleChange}
                                    error={errors.cover}
                                    ref={coverRef}
                                />
                                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
                                    Cancel
                                </button>
                                <button type="submit" className={`text-base-white ${buttonIsLoading ? 'bg-neutral-300 pointer-events-none' : 'bg-brand-300 pointer-events-auto'}`} disabled={buttonIsLoading}>
                                    {buttonIsLoading ? <ButtonSpin /> : 'Save'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </>
        )
}

export default ProfileEditModal;