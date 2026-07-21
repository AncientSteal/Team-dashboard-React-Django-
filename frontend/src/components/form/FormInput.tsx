import type { FormInputProps } from "../../types/Form";

export function FormInput({ label, name, error, ref, className = "", ...props }:FormInputProps) {
    return (
        <div className="flex flex-col gap-1 w-full text-dark-700">
            <label htmlFor={name} className={label ? '' : 'sr-only'}>{label || name}</label>
            <input name={name} id={name} ref={ref} className={`mb-0.5 text-dark-700 ${className}`}
                {...props}
            />
            {error && <span className="text-red-500 text-sm font-normal mb-2">{error}</span>}
        </div>
    );
}