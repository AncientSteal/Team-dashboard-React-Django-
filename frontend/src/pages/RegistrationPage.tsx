import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../components/form/FormInput";
import { formValidation } from "../features/Validation";
import { useForm } from "../hooks/useForm";
import ButtonSpin from "../components/ui/ButtonSpin";
import { useAuth } from "../hooks/useAuth";
import { registrationRequest } from "../api/apiRegistration";

function RegistrationPage() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const { formData, errors, setErrors, buttonIsLoading, setBtnIsLoading, handleChange, handleSubmit } = useForm({
        initialValues: { login: '', password: '', email: '', password_repeat: ''},
        validate: formValidation,
        onSubmit: async(values) => {
            try {
                const result = await registrationRequest(values.login, values.password, values.email);
                if (result && result.status === 'error') {
                    setErrors({ login: result.message });
                } else if (result && result.status === 'success') {
                    login(result.token, result.user);
                    navigate('/');
                }
            } catch (serverError: unknown) {
                if (serverError instanceof Error) {
                    setErrors({ login: serverError.message }); 
                } else {
                    setErrors({ login: 'Something went wrong. Please try again.' }); 
                }
            } finally {
                setBtnIsLoading(false);
            }
        } 

    })

    return (
        <section>
            <div className="mx-auto md:max-w-[90vw] max-w-[60vw] flex flex-col py-24 md:py-36 my-auto gap-8 md:gap-16 items-center">
                <div className="flex flex-col gap-6 text-center">
                    <span className="text-brand-200 text-base">Registration</span>
                    <h2 className="text-4xl md:text-5xl font-semibold text-brand-100">Sign Up</h2>
                    <p className="text-dark-700">We’d want to work with you, let's start.</p>
                </div>
                <form onSubmit={handleSubmit} id="registration-form" className="text-sm text-dark-700 font-medium w-full lg:w-[30vw] md:w-[60vw] flex flex-col gap-2" action="" noValidate>
                    
                    <FormInput 
                        label="Login"
                        name="login"
                        type="text"
                        placeholder="login"
                        value={formData.login}
                        onChange={handleChange}
                        error={errors.login}
                    />
                    <FormInput 
                        label="Email adress"
                        name="email"
                        type="text"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <FormInput 
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="example45!_"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    <FormInput 
                        label="Repeat your password"
                        name="password_repeat"
                        type="password"
                        placeholder="example45!_"
                        value={formData.password_repeat}
                        onChange={handleChange}
                        error={errors.password_repeat}
                    />
                    <button type="submit" className={`text-base-white ${buttonIsLoading ? 'bg-neutral-300 pointer-events-none' : 'bg-brand-300 pointer-events-auto'}`} disabled={buttonIsLoading}>
                        {buttonIsLoading ? <ButtonSpin /> : 'Registration'}
                    </button>
                    <Link to="/login" className={`${buttonIsLoading ? 'pointer-events-none bg-neutral-300' : 'pointer-events-auto bg-brand-50'} p-2.5 text-base text-center flex justify-center rounded-lg font-semibold h-fit hover:scale-105 cursor-pointer transform transition-all duration-300 ease-in-out will-change-transform focus:outline-none text-dark-800 w-full`} aria-disabled={buttonIsLoading}>
                        Log in
                    </Link>
                </form>
            </div>
        </section>
    )
    
}

export default RegistrationPage;