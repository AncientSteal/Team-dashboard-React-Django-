import { Link } from "react-router-dom";
import type { NavigationLinkProps } from "../../types/Navigation";
import { useAuth } from "../../hooks/useAuth";
import { ComingSoonLabel } from "./ComingSoonLabel";

function NavigationLinksList({ links, active}: NavigationLinkProps) {
    const { logout } = useAuth();
    return (
        <div className={`text-link-gray-300 font-medium flex-col gap-2 pl-10 ${active ? 'flex' : 'hidden'} `}>
            {links.map((link) => {
                if (link.path === './logout') {
                    return (
                        <button key={link.link} onClick={logout} className="relative py-1 px-0 w-fit hover:text-gray-100 transition-all duration-300 ease-in-out">
                            {link.link}
                        </button>
                    )
                }
                return (
                    <Link key={link.link} to={link.path} className="relative py-1 hover:text-gray-100 transition-all duration-300 ease-in-out">
                        {link.link}
                        {link.soon && (
                            <div className="absolute top-2 right-12">
                                <ComingSoonLabel />
                            </div>
                    )}
                    </Link>
                )
            })}
            
        </div>
    )
}

export default NavigationLinksList;