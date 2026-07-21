import { MessagesBtn } from "../components/ui/MessagesBtn";
import { NotificationIcon } from "../components/ui/NotificationsBtn";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { UserInfo } from "../components/ui/UserInfo";

function Header() {
    return (
        <div className="h-full px-8 flex justify-between items-center">
            <div>
                
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