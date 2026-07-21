import { useEffect, useState } from "react";
import { tasksRequest } from "../api/apiTasks";
import { useAuth } from "../hooks/useAuth";
import type { Task } from "../types/Tasks";
import ButtonSpin from "../components/ui/ButtonSpin";
import KanbanCard from "../components/ui/Kanban";
import TaskCreateModal from "../modals/TaskCreateModal";
import TaskEditModal from "../modals/TaskEditModal";

function Tasks() {

    const { token } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleTaskUpdated = (updatedTask: Task) => {
        if (!updatedTask) {
            return;
        }
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
    }

    const handleTaskCreated = (newTask: any) => {
        if (!newTask) {
            return;
        }
        setTasks(prev => [...prev, newTask]);
    };

    const handleTaskDeleted = (task_id: number | string) => {
        setTasks(prev => prev.filter(task => task.id !== task_id));
    };

    useEffect(() => {
        const fetchTasks = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const result = await tasksRequest(token);
                if (result.status === 'success') {
                    setTasks(result.tasks)
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError("Failed to load tasks");
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchTasks();    
    }, [token]);

    if (isLoading) return
        <div className="mx-auto mt-20">
            <ButtonSpin />
        </div>

    if (error) return 
        <div className="mx-auto text-center mt-20 text-red-500">
            {error}
        </div>

    const todoTasks = tasks.filter(task => task.status === 'todo');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const doneTasks = tasks.filter(task => task.status === 'done');

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-title-dark">Kanban Board</h2>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-brand-200 hover:bg-brand-100 text-base-white rounded-none font-medium px-4 py-2 transition transform active:scale-95 cursor-pointer"
                >
                    + Add Task
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[70vh]">
                <div className="bg-gray-200 p-4 flex flex-col gap-4 overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-title-dark">To Do</span>
                        <span className="bg-created-cyan flex items-center justify-center text-xs w-6 h-6 rounded-full">{todoTasks.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {todoTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onEditClick={(task) => setEditingTask(task)} />
                        ))}
                        {todoTasks.length === 0 && <p className="text-gray-400 text-xs text-center my-4">No tasks</p>}
                    </div>
                </div>
                <div className="bg-gray-200 p-4 flex flex-col gap-4 overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-title-dark">In Progress</span>
                        <span className="bg-created-cyan flex items-center justify-center text-xs w-6 h-6 rounded-full">{inProgressTasks.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {inProgressTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onEditClick={(task) => setEditingTask(task)} />
                        ))}
                        {todoTasks.length === 0 && <p className="text-gray-400 text-xs text-center my-4">No tasks</p>}
                    </div>
                </div>
                <div className="bg-gray-200 p-4 flex flex-col gap-4 overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-center border-b pb-2">
                        <span className="font-bold text-title-dark">Done</span>
                        <span className="bg-created-cyan flex items-center justify-center text-xs w-6 h-6 rounded-full">{doneTasks.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {doneTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onEditClick={(task) => setEditingTask(task)} />
                        ))}
                        {todoTasks.length === 0 && <p className="text-gray-400 text-xs text-center my-4">No tasks</p>}
                    </div>
                </div>
            </div>
            <TaskCreateModal 
                isModalOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onTaskCreated={handleTaskCreated}
            />
            <TaskEditModal 
                isModalOpen={editingTask !== null}
                task={editingTask}
                onClose={() => setEditingTask(null)}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={(handleTaskDeleted)}
            />
        </div>
        
    )

}
export default Tasks;