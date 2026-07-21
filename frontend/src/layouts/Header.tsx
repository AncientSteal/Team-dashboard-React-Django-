import { MessagesBtn } from "../components/ui/MessagesBtn";
import { NotificationIcon } from "../components/ui/NotificationsBtn";
import { ThemeToggle } from "../components/ui/ThemeToogle";
import { UserInfo } from "../components/ui/UserInfo";

function Header() {
    return (
        <div className="h-full px-8 flex justify-between items-center">
            <div>
                <search>
                    <div className="relative flex items-center text-dark-text-300">
                        <div className="absolute left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-dark-text-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input onChange={(event) => console.log(event.target.value)} type="search" placeholder="Type to search..." className="flex border-none mr-2 justify-start py-3 pl-11 pr-4 text-base font-medium rounded-lg text-dark-text-300"/>
                    </div>
                </search>
            </div>
            <div className="flex gap-7">
                <div className="m-auto">
                    <ThemeToggle />
                </div>
                <div className="flex gap-4 m-auto">
                    <NotificationIcon />
                    <MessagesBtn />
                </div>
                <UserInfo />
            </div>
        </div>
    )
}

export default Header;