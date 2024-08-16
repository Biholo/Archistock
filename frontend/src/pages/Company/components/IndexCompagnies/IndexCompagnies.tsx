import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';

import {
    Bell
} from "@phosphor-icons/react";

export default function IndexCompagnies( {companies}) {

    const navigate = useNavigate();
    useEffect(() => {
        console.log('companies', companies);
    }
    , [companies]);

    const openCompany = (id) => {
        navigate(`/company/detail/${id}`);
    }

  return (
    <div className='index-companies'>
        <div className='flex justify-between items-center'>
            <h2>Vos entreprises</h2>
            <div className='flex items-center'>
                <Button css="mr-3" onClick={e => navigate('/company/no-company')}>Ajouter une entreprise</Button>
                <Bell className='primary cursor-pointer' size={35} />
            </div>
        </div>
        <div className='flex flex-wrap mt-5'>
        {
            companies.map((company) => (
                <div key={company.id} className='company-card cursor-pointer bg-white mr-10 flex flex-col items-center p-4 shadow rounded-2xl' onClick={e => openCompany(company.id)}>
                    <div className="image-container flex items-center justify-center h-full">
                        <img src={'http://localhost:8000/' + company.icon} alt="Logo company" />
                    </div>
                    <h3 className='mt-4 text-xl	'>{company.name}</h3>
                </div>
            ))
        }
        </div>
    </div>
  )
}
