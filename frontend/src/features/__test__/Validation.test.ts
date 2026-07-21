import { formValidation } from "../Validation";

describe('Тестирование фукнции валидации форм', () => {
    test('Должна возвращать ошибки, если обязательные поля полностью пустые или состоят из пустых символов', () => {
        const mockData = { 
            login: '',  
            email: '', 
            password: '', 
            password_repeat: '', 
            avatar_url: '', 
            bio: '',
            position: '',
            cover: '',
            deadline: '',
            task_description: '',
            task_title: '',
            taskStatus: '',
        };
        const result = formValidation(mockData);
        const emptyValueMessage = 'Cannot be empty or contain empty symbols';
        const optionalFields = ['avatar_url', 'cover', 'deadline', 'bio', 'task_description', 'position', 'taskStatus'];
        const requiredFields = ['login', 'email', 'password', 'password_repeat', 'task_title'];

        requiredFields.forEach(field => expect(result?.[field]).toBe(emptyValueMessage));
        optionalFields.forEach(field => expect(result?.[field]).toBeFalsy());
    });


    test('не должно быть ошибок на корректный формат полей ввода', () => {

        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);

        const mockData = { 
            login: 'lover123',  
            email: 'some@mail.com', 
            password: 'password123!', 
            password_repeat: 'password123!', 
            bio: 'Content creator for Figma projects',
            position: 'UX Designer',
            deadline: futureDate.toISOString().slice(0, 16),
            task_description: 'Fix the DB problem for SQL error.',
            task_title: 'Fix the buggs',
            taskStatus: 'todo',
        };

        const result = formValidation(mockData);
        const fields = ['login', 'email', 'password', 'password_repeat', 'task_title', 'deadline', 'bio', 'task_description', 'position', 'taskStatus'];
        fields.forEach(field => expect(result?.[field]).toBeFalsy());
    });

    test('должна показать текст ошибки на некорректный формат полей ввода', () => {

        const wrongDate = new Date();
        wrongDate.setDate(wrongDate.getDate() - 5);
        const mockData = { 
            login: 'love',  
            email: 'something123', 
            password: 'password_wrong', 
            password_repeat: 'password123!', 
            bio: 'Lo',
            position: 'Lo',
            deadline: wrongDate.toISOString().slice(0, 16),
            task_description: 'Lo',
            task_title: 'Lo',
            taskStatus: 'dose not matter',
        };
        const result = formValidation(mockData);

        expect(result?.login).toBe('Login needs too contain from 5 to 20 characters');
        expect(result?.email).toBe('Email needs too contain @ symbol, email token and domain');
        expect(result?.password).toBe('Passwords needs too contain numbers and special symbols !$#_/-*+=();%,.<>');
        expect(result?.password_repeat).toBe('Passwords do not match');
        expect(result?.taskStatus).toBe('Invalid status selected');
        expect(result?.deadline).toBe('Deadline cannot be in the past');
        expect(result?.bio).toBe('Description needs too contain from 20 to 350 characters');
        expect(result?.position).toBe('Position needs too contain from 4 to 50 characters');
        expect(result?.task_description).toBe('Description needs too contain from 12 to 350 characters');
        expect(result?.task_title).toBe('Task title needs too contain from 4 to 70 characters');
    });
});