import type { FormValidationProps, ValidationRules } from "../types/Validation";

const validationRules:ValidationRules = {
     login: (value) => {
        if (value.length < 5 || value.length > 20) {
            return 'Login needs too contain from 5 to 20 characters'
        }
        return null;
    },
    
    password:  (value) => {
        if (value.length < 9 || value.length > 20) {
            return 'Passwords needs too contain from 9 to 20 characters'
        } else if (!/(?=.*[0-9])(?=.*[!$#_/\-*+=();%,.<>])/.test(value)) {
            return 'Passwords needs too contain numbers and special symbols !$#_/-*+=();%,.<>';
        }
        return null;
    },

    password_repeat: (value, originalPassword) => {
        return value !== originalPassword ? 'Passwords do not match' : null;
    },

    email: (value) => {
        if (!/(^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$)/.test(value)) {
            return 'Email needs too contain @ symbol, email token and domain';
        }
        return null;
    },

    number: (value) => {
        if (!/(^[78])(?=[0-9]{10}$)/.test(value)) {
            return 'Phone needs too contain 11 numbers and starting from 7 or 8'
        }
        return null;
    },

    avatar_url: (value) => {
        if (!value) return null;

        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
        if (!allowedExtensions.test(value)) {
            return 'Invalid file format. Allowed: JPG, JPEG, PNG, WEBP';
        }
        return null;
    },

    position: (value) => {
        if (!value) return null;
        if(value.length < 4 || value.length > 50) {
            return 'Position needs too contain from 4 to 50 characters'
        }
        return null;
    },

    bio: (value) => {
        if (value.length === 0) {
            return null;
        }
        if(value.length < 20 || value.length > 350) {
            return 'Description needs too contain from 20 to 350 characters'
        }
        return null;
    },

    cover: (value) => {
        if (!value) return null;
        
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.webp)$/i;
        if (!allowedExtensions.test(value)) {
            return 'Invalid file format. Allowed: JPG, JPEG, PNG, WEBP';
        }
        return null;
    },

    deadline: (value) => {
        if (!value) return null;
        const selectedDate = new Date(value);
        const now = new Date();

        if (isNaN(selectedDate.getTime())) {
            return 'Invalid date format';
        }

        if (selectedDate < now) {
            return 'Deadline cannot be in the past';
        }
        return null;
    },

    taskStatus: (value) => {
        if (!value) return null;
        const allowedStatuses = ['todo', 'in_progress', 'done'];
        if (!allowedStatuses.includes(value)) {
            return 'Invalid status selected';
        }
        return null;
    },

    task_description: (value) => {
        if (value.length === 0) {
            return null;
        }
        if(value.length < 12 || value.length > 350) {
            return 'Description needs too contain from 12 to 350 characters'
        }
        return null;
    },

    task_title: (value) => {
        if (value.length < 4 || value.length > 70) {
            return 'Task title needs too contain from 4 to 70 characters'
        }
        return null;
    },
};

export function formValidation(formElement: FormValidationProps) {
    const passwordValue = formElement.password?.trim() || '';
    const errors: Record<string, string> = {};
    const optionalFields = ['avatar_url', 'cover', 'deadline', 'bio', 'task_description', 'position', 'taskStatus']

    for (const [key, value] of Object.entries(formElement)) {
        const trimmedValue = (value || '').trim();
        const validateRule = validationRules[key as keyof ValidationRules];

        if (!trimmedValue && !optionalFields.includes(key)) {
            errors[key] = 'Cannot be empty or contain empty symbols';
            continue;
        }

        if (validateRule) {
            const errorMessage = validateRule(trimmedValue, passwordValue);
            if (errorMessage) {
                errors[key] = errorMessage;
            } 
        }
    }
    
    return (Object.keys(errors).length > 0) ? errors : null;
};