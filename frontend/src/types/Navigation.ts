import type { ReactNode } from "react";

export interface NavigationLink {
    link: string;
    path: string;
}

export interface NavigationLinkProps {
    links: NavigationLink[];
    active: boolean;
}

export interface MenuNavigationElement {
    id: string;
    title: string;
    hasMenu: boolean;
    icon: ReactNode;
    subLinks?: NavigationLink[];
}

export interface MenuNavigationBtnProps {
    links: MenuNavigationElement[];
    openMenus: string[];
    toggleMenu: (id: string) => void;
}