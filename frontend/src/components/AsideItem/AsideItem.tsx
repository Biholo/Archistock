import React from "react";
import './AsideItem.scss';
import { Link } from "react-router-dom";

export default function AsideItem({title, icon, link, active, onClick}: {title: string, icon: JSX.Element, link: string, active: boolean, onClick?: () => void}) {
    return (
        <React.Fragment>
                <Link to={link} className={`aside-item flex flex-row items-center px-4 py-3 gap-1 ${active ? 'active' : ''}`} onClick={onClick} >
                    <span className='aside-item-icon'>
                        {icon}
                    </span>
                    <span className='hidden text-sm md:block aside-item-title'>
                        {title}
                    </span>
                </Link>
        </React.Fragment>
    )
}
