import { Outlet } from "react-router-dom";
import MenuNavigation from "../components/ui/MenuNavigation";
import Header from "../layouts/Header";

function DashboardLayout() {
    return (
        <div className="grid grid-cols-[280px_1fr] grid-rows-[80px_1fr] h-screen w-screen overflow-hidden">
            <aside className="col-start-1 row-span-2 overflow-y-auto scrollbar-none">
                <MenuNavigation />
            </aside>
            <header className="col-start-2 row-start-1 bg-header-white">
                <Header/>
            </header>
            <main className="col-start-2 row-start-2">
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout;