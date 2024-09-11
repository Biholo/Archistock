import React from 'react';
import { CheckCircle } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
export default function CardPricing({ name, price, features, label, mainColor, secondaryColor, large=false }) {
    const navigate = useNavigate();

    return (
        <div 
            className={`flex flex-col ${large ? 'px-[65px]' : 'px-[45px]'} ${large ? 'py-[55px]' : 'py-[40px]'}  items-center justify-center shadow-lg rounded-lg p-4 text-white`} 
            style={{ backgroundColor: mainColor, color: secondaryColor }}
        >
            <div className='px-[35px]'>
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-800" style={{ color: secondaryColor}}>{name}</h2>
                    <p className='text-sm'>
                        {label}
                    </p>
                </div>
                <p className="text-5xl font-extrabold my-10">${price}</p>
                <ul className="text-sm text-gray-600 my-10 h-[320px] w-[200px]">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center my-3">
                            <CheckCircle weight="fill" size={20} style={{ color: secondaryColor }} />
                            <span className="ml-2" style={{ color: secondaryColor }}>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* <button className="text-sm text-white w-full py-2 rounded-full" style={{ backgroundColor: secondaryColor, color: `${mainColor} === rgba(255, 255, 255, 0.4) ? white : ${mainColor}` }}> */}
            <button onClick={() => navigate('/register')} className={`text-sm text-white w-full py-2 rounded-full `} style={{ backgroundColor: secondaryColor, color: large ?  mainColor : 'white'}}>
                S'abonner maintenant
            </button>
        </div>
    )
}
