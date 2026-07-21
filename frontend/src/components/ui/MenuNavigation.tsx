import { useAuth } from "../../hooks/useAuth";
import type { MenuNavigationElement } from "../../types/Navigation";
import { Authentication, Calendar, Dashboard, Inbox, Invoice, Messager, Profile, Task } from "./Icons";
import MenuNavigationBtn from "./MenuNavigationBtn";
import { useMemo, useState } from "react";

function MenuNavigation() {

    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const { user } = useAuth();

    const toggleMenu = (menuId: string) => {
        setOpenMenus(prev => 
            prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
        );
    };

    const menuLinks: MenuNavigationElement[] = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: <Dashboard />,
            hasMenu: true,
            soon: true,
            subLinks: [
                { link: 'eCommerce', path: './eCommerce', soon: true },
                { link: 'Analytics', path: './Analytics', soon: true }
            ]
        },
        {
            id: 'calendar',
            title: 'Calendar',
            icon: <Calendar />,
            hasMenu: false,
            soon: true,
        },
        {
            id: 'profile',
            title: 'Profile',
            icon: <Profile />,
            hasMenu: false,
        },
        {
            id: 'task',
            title: 'Task',
            icon: <Task  />,
            hasMenu: true,
            subLinks: [
                { link: 'List', path: './Task/List', soon: true },
                { link: 'Kanban', path: './Task/Kanban' }
            ]
        },
    ];

    const supportLinks: MenuNavigationElement[] = [
        { id: 'messages', title: 'Messages', icon: <Messager />, hasMenu: false, soon: true },
        { id: 'inbox', title: 'Inbox', icon: <Inbox />, hasMenu: false, soon: true },
        { id: 'invoice', title: 'Invoice', icon: <Invoice />, hasMenu: false, soon: true },
    ];

    const otherLinks = useMemo((): MenuNavigationElement[] => {
        if (!user) {
            return [
                { 
                    id: 'auth', 
                    title: 'Authentication', 
                    icon: <Authentication />, 
                    hasMenu: true,
                    subLinks: [
                        { link: 'Sign In', path: './signin' },
                        { link: 'Sign Up', path: './signup' },
                        { link: 'Reset Password', path: './reset-password', soon: true},
                    ]
                },
            ];
        }
        return [
            { 
                id: 'auth', 
                title: 'Account',
                icon: <Authentication />, 
                hasMenu: true,
                subLinks: [
                    { link: 'Log Out', path: './logout' },
                    { link: 'Reset Password', path: './reset-password', soon: true }, 
                ]
            },
        ];
    }, [user]);

    return (
        <div className="pt-10 px-6 flex flex-col bg-dark-800 h-full">
            <div className="mx-4 pb-12 max-h-8 max-w-42 shrink-0">
                <img src="/Logo/Logo.svg" alt="Logo TailAdmin" />
            </div>
            <menu className="flex scrollbar-none flex-col gap-1.5 px-4 text-base-white font-medium overflow-y-auto pr-1">

                <p className="text-dark-200 pb-2">MENU</p>
                <MenuNavigationBtn links={menuLinks} openMenus={openMenus} toggleMenu={toggleMenu} />
                
                <p className="text-dark-200 pb-2">SUPPORT</p>
                <MenuNavigationBtn links={supportLinks} openMenus={openMenus} toggleMenu={toggleMenu} />
                
                <p className="text-dark-200 pb-2">OTHERS</p>
                <MenuNavigationBtn links={otherLinks} openMenus={openMenus} toggleMenu={toggleMenu} />

            </menu>
        </div>
    )
}

export default MenuNavigation;