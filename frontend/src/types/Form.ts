import React from "react";

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string,
    name: string,
    error?: string,
    ref?: React.RefObject<HTMLInputElement | null>,
}

export interface UseFormOptions<T> {
    initialValues: T;
    validate: (values: T) => Record<string, string> | null;
    onSubmit: (values: T) => void | Promise<void>;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    error?: string;
    options: { value: string, label: string }[];
}