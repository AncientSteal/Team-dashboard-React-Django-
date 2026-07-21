import { MessagesIco } from "./Icons";

export function MessagesBtn() {


    return (
        <button className="rounded-full p-0 text-gray-300 cursor-pointer transition-all duration-300 ease-in-out focus:outline-none">
            <div className="h-9 w-9 bg-gray-100 rounded-full border border-stroke-gray-300 flex items-center justify-center">
                <MessagesIco />
            </div>
        </button>
    )
};