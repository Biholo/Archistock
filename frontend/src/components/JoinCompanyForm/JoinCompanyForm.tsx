import React, { useEffect, useState } from 'react';
import Input from '../Input/Input';
import InputSuggestion from '../InputSugestion/InputSugestion';
import "flag-icons/css/flag-icons.min.css";
import ArchistockApiService from '../../services/ArchistockApiService';
import Button from '../Button/Button';
import { useAuth } from '../../contexts/AuthContext';

interface Country {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

interface NewCompany {
    name: string;
    city: string;
    country: string;
    street: string;
    postalCode: string;
}

interface Company {
    id: number;
    name: string;
    addressId: number;
    createdAt: string;
    updatedAt: string;
}


export default function JoinCompanyForm() {
    const archistockApiService = new ArchistockApiService();
    const [joiningStep, setJoiningStep] = useState<'select_choice' | 'find_company' | 'create' | 'end_form'>('select_choice');
    const [newCompany, setNewCompany] = useState<NewCompany>({
        name: '',
        city: '',
        country: '',
        street: '',
        postalCode: ''
    });

    const [countries, setCountries] = useState<Country[]>([]);
    const [countrySuggestions, setCountrySuggestions] = useState<Country[]>([]);
    const [searchedCountry, setSearchedCountry] = useState<string>('');

    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesSuggestions, setCompaniesSuggestions] = useState<Company[]>([]);
    const [searchedCompany, setSearchedCompany] = useState<string>('');
    const [companySelectedId, setCompanySelectedId] = useState<number | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>('');

    const [requestSent, setRequestSent] = useState([]);

    const { user } = useAuth();

    const [myCompanies, setMyCompanies] = useState<Company[]>([]);

    useEffect(() => {
        if(user && user.id) {
            archistockApiService.findCompaniesByUserId(user.id).then((response) => {
                setMyCompanies(response);
                console.log('my companies', response);
            });
        }
    }
    );

    useEffect(() => {
        if (user && user.id) {
            archistockApiService.findInvitationsByUserId(user.id).then((response) => {
                console.log('invitation request sent', response);
                setRequestSent(response);
            }
            );
        }
    }, [user]);

    useEffect(() => {
        archistockApiService.findAllCountries().then(
            (response: Country[]) => {
                setCountries(response);
            }
        );
    }, []);

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

    const handleSelectCompany = (suggestion: string) => {
        setSearchedCompany(suggestion);
        setCompanySelectedId(companies.find(company => company.name === suggestion)?.id || null);
        setCompaniesSuggestions([]);
    }


    const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchedCountry(searchValue);
        setCountrySuggestions(countries.filter(country =>
            country.name.toLowerCase().includes(searchValue.toLowerCase())
        ));
    }

    const handleSelectCountry = (suggestion: Country) => {
        setNewCompany({ ...newCompany, country: suggestion.id });
        setSearchedCountry(suggestion.name);
        setCountrySuggestions([]);
    }

    const renderCountriesSugestions = () => {
        return countrySuggestions.map(country => (
            <div key={country.id} onClick={() => handleSelectCountry(country)}>
                <span className={`fi fi-${country.code.toLowerCase()} fis`} style={{ marginRight: '8px' }}></span>
                {country.name}
            </div>
        ));
    }

    const renderCompaniesSuggestions = () => {
        return companiesSuggestions.map(company => (
            <div key={company.id} onClick={() => handleSelectCompany(company.name)}>
                {company.name}
            </div>
        ));
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




    const renderStep = () => {
        switch (joiningStep) {
            case 'find_company':
                return (
                    <div>
                        <h2>Recherche d'une entreprise</h2>
                        <div className='flex flex-col items-center'>

                            <div className='flex items-end justify-center'>
                                <InputSuggestion
                                    value={searchedCompany}
                                    onChange={handleCompanyChange}
                                    css={'w-72'}
                                    name="company"
                                    label="Company"
                                    type="text"
                                    labelWeight="bold"
                                    placeholder="Company name"
                                    required={true}
                                    suggestions={renderCompaniesSuggestions()}
                                />

                                <Button onClick={() => askToJoinCompany()} disabled={checkIfUserCanRequest(companySelectedId) ? false : true} css='w-2/6 ml-4' color='primary'>Rejoindre</Button>
                            </div>
                            <p onClick={() => setJoiningStep('create')} className='text-xs underline mt-3 cursor-pointer'>Vous ne trouvez pas votre entreprise ? Référencer là !</p>
                        </div>
                    </div>
                );
            case 'select_choice':
                return (
                    <div>
                        <h2>Select Choice</h2>
                        {/* Contenu pour sélectionner une option */}
                        <div onClick={() => setJoiningStep('create')}>Create</div>
                        <div onClick={() => setJoiningStep('find_company')}>Join</div>
                    </div>
                );
            case 'create':
                return (
                    <div className='w-72'>
                        <h2>Création d'une entreprise</h2>
                        <Input
                            value={newCompany.name}
                            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                            css={'w-full mb-3'}
                            name="name"
                            label="Name"
                            type="text"
                            labelWeight="bold"
                            placeholder="Company name"
                            required={true}
                        />
                        <InputSuggestion
                            value={searchedCountry}
                            onChange={handleCountryChange}
                            onSelect={(suggestion) => handleSelectCountry(suggestion)}
                            css={'w-full mb-3'}
                            name="country"
                            label="Country"
                            type="text"
                            labelWeight="bold"
                            placeholder="Country"
                            required={true}
                            suggestions={renderCountriesSugestions()}
                        />
                        <Input
                            value={newCompany.city}
                            onChange={(e) => setNewCompany({ ...newCompany, city: e.target.value })}
                            css={'w-full mb-3'}
                            name="city"
                            label="City"
                            type="text"
                            labelWeight="bold"
                            placeholder="City"
                            required={true}
                        />
                        <Input
                            value={newCompany.street}
                            onChange={(e) => setNewCompany({ ...newCompany, street: e.target.value })}
                            css={'w-full mb-3'}
                            name="street"
                            label="Street"
                            type="text"
                            labelWeight="bold"
                            placeholder="Street"
                            required={true}
                        />
                        <div className='flex w-full justify-between'>
                            <Button css='w-2/6' color='secondary' onClick={() => setJoiningStep('select_choice')}>Retour</Button>
                            <Button css='w-3/6' color='primary' onClick={() => setJoiningStep('end_form')}>Créer</Button>
                        </div>

                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderStep()}
        </div>
    );
}
