import React, { useState, useEffect } from 'react'
import {
    Factory,
    DoorOpen
} from "@phosphor-icons/react";
import './Company.scss'
import JoinCompanyForm from '../../components/JoinCompanyForm/JoinCompanyForm';

import CreateCompany from './components/CreateCompany/CreateCompany';
import Parameter from './components/Parameter/Parameter';
import FindCompany from './components/FindCompany/FindCompany';
import IndexCompagnies from './components/IndexCompagnies/IndexCompagnies';
import NoCompany from './components/NoCompany/NoCompany';
import CompanyDetail from './components/CompanyDetail/CompanyDetail';
import ArchistockApiService from '../../services/ArchistockApiService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

export default function Company() {
    const { user } = useAuth();
    const archistockApiService = new ArchistockApiService();
    const [companies, setCompanies] = useState([]);
    const [rights, setRights] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.id) {
            archistockApiService.findCompaniesByUserId(user.id).then((response) => {
                setRights(response);
                const companies = response.map((right) => right.company);
                setCompanies(companies);
                if (companies.length === 0) {
                    navigate("/company/no-company")
                }

            });
        }
    }, [user]);

    const updateCompanies = () => {
        if (user && user.id) {
            archistockApiService.findCompaniesByUserId(user.id).then((response) => {
                setRights(response);
                const companies = response.map((right) => right.company);
                setCompanies(companies);
                if (companies.length === 0) {
                    navigate("/company/no-company")
                }

            });
        }
    }



    return (
        <div className="company p-10 h-full">
            <Routes>
                <Route path="/company/no-company" element={<NoCompany />} />
                <Route path="/company/find" element={<FindCompany />} />
                <Route path="/company/create" element={<CreateCompany />} />
                <Route path="/company/detail/:id" element={<CompanyDetail />} />
                <Route path="/company" element={<IndexCompagnies companies={companies} updateCompanies={updateCompanies} />} />
                <Route path="/company/:id/parameter" element={<Parameter />} />
            </Routes>
        </div>
    );

}