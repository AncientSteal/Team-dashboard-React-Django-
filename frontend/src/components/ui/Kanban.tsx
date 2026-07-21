import type { KanbanCardProps } from "../../types/Tasks";
import { formatDate } from "../../utils/formatDate";
import { EditIcon } from "./Icons";

function KanbanCard(props: KanbanCardProps) {
    const { title, description, created_at, updated_at, deadline, onEditClick } = props;
    return (
        
        <div className="p-2 md:p-3 bg-gray-150 font-medium">
            <div className="flex justify-between">
                <h4 className="text-title-dark font-semibold text-base md:text-[18px]">{title}</h4>
                <button 
                    onClick={() => onEditClick(props)}
                    className="bg-brand-50 w-6 h-6 p-1 rounded-none text-base-white"
                >
                    <EditIcon />
                </button>
            </div>
            <p className="text-sm md:text-base font-normal text-title-dark py-2">{description}</p>
            <div className="flex gap-2 text-[10px] font-normal text-dark-text-700">
                <p className="bg-created-cyan p-0.5 ">Created: {formatDate(created_at, false)}</p>
                {updated_at && updated_at !== created_at && (
                    <p className="bg-update-purple p-0.5">Updated: {formatDate(updated_at, false)}</p>
                )}
                {deadline && <p className="bg-deadline-red p-0.5">Deadline: {formatDate(deadline, true)}</p>}
            </div>
        </div>
    )
}

export default KanbanCard;