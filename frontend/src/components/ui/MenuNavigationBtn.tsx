import { Link } from "react-router-dom";
import type { MenuNavigationBtnProps } from "../../types/Navigation";
import { ArrowIco } from "./Icons";
import NavigationLinksList from "./NavigationLinksMenu";
import { ComingSoonLabel } from "./ComingSoonLabel";

function MenuNavigationBtn({ links, openMenus, toggleMenu }: MenuNavigationBtnProps) {

    return (
        <>
            {links.map((link) => {

                const isActive = openMenus.includes(link.id);
                const path = link.title.toLocaleLowerCase();

                if (!link.hasMenu) return (
                    <div  key={link.id} className="flex flex-col w-full">
                        <Link 
                            to={path}
                            className="px-4 py-3 flex justify-between items-center"
                        >
                            
                            <div className="flex relative items-center gap-2.5">
                                {link.icon}
                                <p className="text-dark-200">{link.title}</p>
                                {link.soon && (
                                    <div className="absolute top-1 -right-4">
                                        <ComingSoonLabel />
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                )

                return (
                    <div key={link.id} className="flex flex-col w-full">
                        <button 
                            onClick={() => link.hasMenu && toggleMenu(link.id)} 
                            className="px-4 py-3 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2.5">
                                {link.icon}
                                <p className="text-dark-200">{link.title} </p>
                            </div>
                            

                            { link.hasMenu && (
                                <div className={`transform transition-transform ${ isActive ? 'rotate-180' : ''}`}>
                                    <ArrowIco />
                                </div>
                            )}
                        </button>

                        {link.hasMenu && link.subLinks && (
                            <div 
                                className={`grid transition-all duration-300 ease-in-out ${
                                    isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <NavigationLinksList
                                        links={link.subLinks}
                                        active={true}
                                    />
                                    {link.soon && (<ComingSoonLabel />)}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </>  
    );
}

export default MenuNavigationBtn;