import { createTaskRequest } from "../api/apiCreateTask";
import { FormInput } from "../components/form/FormInput";
import { FormSelect } from "../components/form/FormSelect";
import ButtonSpin from "../components/ui/ButtonSpin";
import { formValidation } from "../features/Validation";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";
import type { TaskModalProps } from "../types/Modal";

function TaskCreateModal({ onClose, isModalOpen, onTaskCreated }: TaskModalProps) {
    const { token } = useAuth();

    const { formData, errors, setErrors, buttonIsLoading, setBtnIsLoading, handleChange, handleSubmit} = useForm({
        initialValues: { task_title: '', task_description: '', taskStatus: 'todo', deadline: ''}, 
        validate: formValidation,
        onSubmit: async (values) => {
            try {
                if (!token) {
                    setErrors({ task_title: 'Authentication token is missing. Please re-login.' });
                    return;
                } 
                const result = await createTaskRequest(values.task_title, values.task_description, values.deadline, values.taskStatus, token);

                if (result.status === 'error') {
                    setErrors({ task_title: result.message })
                } else if (result.status === 'success') {
                    onTaskCreated(result.task);
                    onClose();
                }
            } catch (err) {
                setErrors({ task_title: 'Something went wrong' })
            } finally {
                setBtnIsLoading(false);
            }
        }
    });

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gray-200 rounded-2xl p-3 md:p-4 w-fit min-w-[30%] shadow-2xl flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-dark-700">Create New Task</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-lg cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
                    <FormInput 
                        label="Task Title" name="task_title" type="text" placeholder="Fix layout bugs..."
                        value={formData.task_title} onChange={handleChange} error={errors.task_title}
                    />
                    <FormInput 
                        label="Description" name="task_description" type="text" placeholder="Detailed info about the subtasks..."
                        value={formData.task_description} onChange={handleChange} error={errors.task_description}
                    />
                    <FormSelect
                        label="Task Status"
                        name="taskStatus"
                        value={formData.taskStatus}
                        onChange={handleChange}
                        error={errors.taskStatus}
                        options={[
                            {value: 'todo', label: 'To Do'},
                            {value: 'in_progress', label: 'In Progress'},
                            {value: 'done', label: 'Done'},
                        ]}
                    />
                    <FormInput 
                        label="Deadline" name="deadline" type="datetime-local" min={new Date().toISOString().slice(0, 16)}
                        value={formData.deadline} onChange={handleChange} error={errors.deadline}
                    />

                    <div className="flex gap-2 justify-between mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-dark-700 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-base-white bg-brand-300 rounded-lg cursor-pointer hover:bg-brand-200" disabled={buttonIsLoading}>
                            {buttonIsLoading ? <ButtonSpin /> : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TaskCreateModal;