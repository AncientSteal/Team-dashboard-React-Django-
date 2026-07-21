import { useEffect, useState } from "react";
import type { UseFormOptions } from "../types/Form";

export function useForm<T extends Record<string, string>>({initialValues, validate, onSubmit}: UseFormOptions<T>) {
    
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [buttonIsLoading, setBtnIsLoading] = useState(false);

    const initialValuesStr = JSON.stringify(initialValues);

    useEffect(() => {
        setFormData(JSON.parse(initialValuesStr));
        setErrors({});
    }, [initialValuesStr]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));

        if(errors[name]) {
            setErrors(prev => {
                const newErrors = {...prev};
                delete newErrors[name];
                return newErrors;
            });
        }
    }

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationResult = validate(formData);

        if (validationResult) {
            setErrors(validationResult);
        } else {
            setErrors({});
            setBtnIsLoading(true);
            onSubmit(formData);
        }
        
    };

    return { formData, errors, setErrors, buttonIsLoading, setBtnIsLoading, handleChange, handleSubmit };
}