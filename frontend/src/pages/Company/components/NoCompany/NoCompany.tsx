import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Buildings,
    HandArrowUp
} from "@phosphor-icons/react";


export default function NoCompany() {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center h-full'>
            <h2 className='w-full'>Sélectionner un choix</h2>
            <div className='flex justify-center items-center h-full'>
                <div className='cursor-pointer flex flex-col items-center bg-white shadow p-10 rounded-2xl' onClick={() => navigate('/company/create')}>
                    <Buildings  size={250} />
                   <h4> Crééer une entreprise</h4>
                </div>
                <p className='mx-10 text-2xl font-light'>ou</p>
                <div className='cursor-pointer flex flex-col items-center bg-white shadow p-10 rounded-2xl' onClick={() => navigate('/company/find')}>
                    <HandArrowUp size={250} />
                    <h4>Rejoindre une entreprise</h4>
                </div>
            </div>
        </div>)
}
