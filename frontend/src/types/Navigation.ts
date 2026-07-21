import type { ReactNode } from "react";

export interface NavigationLink {
    link: string;
    path: string;
    soon?: boolean;
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
    soon?: boolean;
}

export interface MenuNavigationBtnProps {
    links: MenuNavigationElement[];
    openMenus: string[];
    toggleMenu: (id: string) => void;
}