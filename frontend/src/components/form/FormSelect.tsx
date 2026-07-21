import type { FormSelectProps } from "../../types/Form";

export function FormSelect({ label, name, error, options, ...props }: FormSelectProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="font-medium text-dark-700" htmlFor={name}>{label}</label>
            <select 
                name={name} 
                id={name} 
                className="w-full border p-2 rounded-lg text-dark-700 focus:outline-none"
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className="text-red-500 text-sm font-normal mb-2">{error}</span>}
        </div>
    )
}