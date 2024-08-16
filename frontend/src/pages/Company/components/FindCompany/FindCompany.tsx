import React, { useEffect, useState } from 'react';
import Input from '../../../../components/Input/Input';
import InputSuggestion from '../../../../components/InputSugestion/InputSugestion';
import "flag-icons/css/flag-icons.min.css";
import ArchistockApiService from '../../../../services/ArchistockApiService';
import Button from '../../../../components/Button/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Company {
    id: number;
    name: string;
    addressId: number;
    createdAt: string;
    updatedAt: string;
}

export default function FindCompany() {
    const { user } = useAuth();
    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();

    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesSuggestions, setCompaniesSuggestions] = useState<Company[]>([]);
    const [searchedCompany, setSearchedCompany] = useState<string>('');
    const [companySelectedId, setCompanySelectedId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [requestSent, setRequestSent] = useState([]);

    useEffect(() => {
        archistockApiService.findAllCompanies().then(
            (response: any) => {
                console.log(response);
                setCompanies(response);
            }
        );
    }, []);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchedCompany(searchValue);
        setCompaniesSuggestions(companies.filter(company =>
            company.name.toLowerCase().includes(searchValue.toLowerCase())
        ));
    }

    const renderCompaniesSuggestions = () => {
        return companiesSuggestions.map(company => (
            <div key={company.id} onClick={() => handleSelectCompany(company.name)}>
                {company.name}
            </div>
        ));
    }

    const handleSelectCompany = (suggestion: string) => {
        setSearchedCompany(suggestion);
        setCompanySelectedId(companies.find(company => company.name === suggestion)?.id || null);
        setCompaniesSuggestions([]);
    }

    const askToJoinCompany = () => {
        if (!companySelectedId) {
            setErrorMessage('Veuillez sélectionner une entreprise');
            return;
        }
        if (!user || !user.id) {
            return;
        }

        archistockApiService.askToJoinCompany(companySelectedId, user.id).then(
            (response) => {
                console.log(response);
            }
        );
    }

    const checkIfUserCanRequest = (companyId: number | null) => {
        if (!companyId) {
            return false;
        }
        //check if user has already sent a request to join this company
        return requestSent.find((request: any) => request.companyId === companyId);
    }

    return (
        <div className='h-full'>
            <h2>Recherche d'une entreprise</h2>
            <div className='flex items-center justify-center h-4/5 w-full'>
                <div className='flex flex-col items-center w-1/2'>
                    <div className='flex items-end justify-center w-full'>
                        <InputSuggestion
                            value={searchedCompany}
                            onChange={handleCompanyChange}
                            css={'w-3/4'}
                            name="company"
                            label="Company"
                            type="text"
                            labelWeight="bold"
                            placeholder="Company name"
                            suggestions={renderCompaniesSuggestions()}
                        />

                        <Button onClick={() => askToJoinCompany()} disabled={checkIfUserCanRequest(companySelectedId) ? false : true} css='w-1/4 ml-4' color='primary'>Rejoindre</Button>
                    </div>
                    <p onClick={() => navigate('/company/create')} className='text-xs underline mt-3 cursor-pointer'>Vous ne trouvez pas votre entreprise ? Référencer là !</p>
                </div>
            </div>
        </div>
    );
}
