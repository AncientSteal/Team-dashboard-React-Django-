import { renderHook } from "@testing-library/react";
import { useForm } from "../useForm";
import { act } from "react";

describe('Тестирование хука useForm', () => {
    const mockValidate = vi.fn();
    const mockOnSubmit = vi.fn();
    const initialValues = { login: '', password: '' };
    
    beforeEach(() => {
        vi.clearAllMocks();
    });

     test('Должен инициализироваться с правильными начальными значениями', () => {
        const { result } = renderHook(() => useForm({
            initialValues,
            validate: mockValidate,
            onSubmit: mockOnSubmit
        }));

        expect(result.current.formData).toEqual(initialValues);
        expect(result.current.errors).toEqual({});
        expect(result.current.buttonIsLoading).toBe(false);
    });

    test('Должен изменять formData при вызове handleChange', () => {
        const { result } = renderHook(() => useForm({
            initialValues,
            validate: mockValidate,
            onSubmit: mockOnSubmit
        }));

        const mockEvent = {
            target: { name: 'login', value: 'new_userName' }
        } as React.ChangeEvent<HTMLInputElement>;

        act(() => {
            result.current.handleChange(mockEvent);
        });

        expect(result.current.formData.login).toBe('new_userName');
        expect(result.current.formData.password).toBe('');
    });

    test('Должен устанавливать ошибки и НЕ запускать отправку, если валидация провалилась', () => {
        mockValidate.mockReturnValue({ login: 'Uncorrect' });

        const { result } = renderHook(() => useForm({
            initialValues,
            validate: mockValidate,
            onSubmit: mockOnSubmit
        }));

        const mockSubmitEvent = {
            preventDefault: vi.fn()
        } as unknown as React.SubmitEvent<HTMLFormElement>; // обманываем компилятор двойным приведением типов

        act(() => {
            result.current.handleSubmit(mockSubmitEvent);
        });

        expect(mockSubmitEvent.preventDefault).toHaveBeenCalled();
        expect(result.current.errors).toEqual({ login: 'Uncorrect' });
        expect(result.current.buttonIsLoading).toBe(false);
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

        test('Должен очищать ошибки, включать загрузку и вызывать onSubmit при успешной валидации', () => {
        mockValidate.mockReturnValue(null);

        const { result } = renderHook(() => useForm({
            initialValues,
            validate: mockValidate,
            onSubmit: mockOnSubmit
        }));

        const mockSubmitEvent = {
            preventDefault: vi.fn()
        } as unknown as React.SubmitEvent<HTMLFormElement>;

        act(() => {
            result.current.handleSubmit(mockSubmitEvent);
        });
        
        expect(result.current.errors).toEqual({});
        expect(result.current.buttonIsLoading).toBe(true);
        expect(mockOnSubmit).toHaveBeenCalledWith(initialValues);
    });

});