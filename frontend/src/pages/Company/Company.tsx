import React, { useState, useEffect } from 'react'
import {
    Factory,
    DoorOpen
} from "@phosphor-icons/react";
import './Company.scss'
import JoinCompanyForm from '../../components/JoinCompanyForm/JoinCompanyForm';


export default function Company() {
    const [companies, setCompanies] = useState([]);
    const [joiningStep, setJoiningStep] = useState('company');
    const [isJoiningCompany, setIsJoiningCompany] = useState(false);

    return (
        <div className='company flex flex-col items-center justify-center h-full'>
            {
                companies.length === 0 && isJoiningCompany === false ? (
                    <div className='flex flex-col items-center justify-center no-company'>
                        <Factory size={300} />
                        <h3 className='text-2xl my-5'>Vous êtes actuellement dans aucune entreprise !</h3>
                        <p className='mt-3 underline cursor-pointer' onClick={e => setIsJoiningCompany(true)}>Rejoindre une entreprise</p>
                    </div>
                ) : (
                    <JoinCompanyForm />
                )

    }


        </div>
    )
}
