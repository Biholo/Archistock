import React from "react";
import './AsideItem.scss';
import { Link } from "react-router-dom";

export default function AsideItem({title, icon, link, active, onClick, isLogout=false}: {title: string, icon: JSX.Element, link: string, active: boolean, onClick?: () => void, isLogout?: boolean}) {
    return (
        <React.Fragment>
            <Link to={link} className={`aside-item flex flex-row justify-center lg:justify-start px-4 py-3 w-auto gap-2 ${active ? 'active' : ''} ${isLogout ? 'logout' : ''}`} onClick={onClick} >
                <span className='aside-item-icon'>
                    {icon}
                </span>
                <span className='hidden text-md lg:block aside-item-title'>
                    {title}
                </span>
            </Link>
        </React.Fragment>
    )
}
