import React, { useState, useEffect } from 'react'
import {
    Factory,
    DoorOpen
} from "@phosphor-icons/react";
import './Company.scss'
import JoinCompanyForm from '../../components/JoinCompanyForm/JoinCompanyForm';

import CreateCompany from './components/CreateCompany/CreateCompany';
import FindCompany from './components/FindCompany/FindCompany';
import IndexCompagnies from './components/IndexCompagnies/IndexCompagnies';
import NoCompany from './components/NoCompany/NoCompany';
import CompanyDetail from './components/CompanyDetail/CompanyDetail';
import ArchistockApiService from '../../services/ArchistockApiService';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

import { Route, Routes } from 'react-router-dom';

export default function Company() {
    const { user } = useAuth();
    const archistockApiService = new ArchistockApiService();
    const [companies, setCompanies] = useState([]);
    const [rights, setRights] = useState([]);

    useEffect(() => {
        if (user && user.id) {
            archistockApiService.findCompaniesByUserId(user.id).then((response) => {
                setRights(response);
                const companies = response.map((right) => right.company);
                setCompanies(companies);
                if(companies.length === 0) {
                    return <Navigate to="/no-company" />
                }

            });
        }
    }, [user]);


    return (
        <>
            <Routes>
                <Route path="/" element={<IndexCompagnies companies={companies} />} />
                <Route path="/no-company" element={<NoCompany />} />
                <Route path="/find" element={<FindCompany />} />
                <Route path="/create" element={<CreateCompany />} />
                <Route path="/detail/:id" element={<CompanyDetail />} />
            </Routes>
        </>
    )
}


 // return (
    //     <div className='company flex flex-col items-center justify-center h-full'>
    //         {

    //             companies.length === 0 && isJoiningCompany === false ? (
    //                 <div className='flex flex-col items-center justify-center no-company'>
    //                     <Factory size={300} />
    //                     <h3 className='text-2xl my-5'>Vous êtes actuellement dans aucune entreprise !</h3>
    //                     <p className='mt-3 underline cursor-pointer' onClick={e => setIsJoiningCompany(true)}>Rejoindre une entreprise</p>
    //                 </div>
    //             ) : (
    //                 <JoinCompanyForm />
    //             )

    // }
