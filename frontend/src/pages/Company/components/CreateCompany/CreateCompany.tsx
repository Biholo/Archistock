import React, { useEffect, useState } from 'react';
import Input from '../../../../components/Input/Input';
import InputSuggestion from '../../../../components/InputSugestion/InputSugestion';
import "flag-icons/css/flag-icons.min.css";
import ArchistockApiService from '../../../../services/ArchistockApiService';
import Button from '../../../../components/Button/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NewCompany {
    name: string;
    city: string;
    countryId: number | null;
    street: string;
    postalCode: string;
    image: any;
}
interface Country {
    id: number;
    name: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}
export default function CreateCompany() {
    const archistockApiService = new ArchistockApiService();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [newCompany, setNewCompany] = useState<NewCompany>({
        name: '',
        city: '',
        countryId: null,
        street: '',
        postalCode: '',
        image: null,
    });

    const [countries, setCountries] = useState<Country[]>([]);
    const [countrySuggestions, setCountrySuggestions] = useState<Country[]>([]);
    const [searchedCountry, setSearchedCountry] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');


    useEffect(() => {
        archistockApiService.findAllCountries().then(
            (response: Country[]) => {
                setCountries(response);
            }
        );
    }, []);

    const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setSearchedCountry(searchValue);
        setCountrySuggestions(countries.filter(country =>
            country.name.toLowerCase().includes(searchValue.toLowerCase())
        ));
    }

    const handleSelectCountry = (suggestion: Country) => {
        setNewCompany({ ...newCompany, countryId: suggestion.id });
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

    const validateForm = () => {
        if (!newCompany.name || !newCompany.city || !newCompany.countryId || !newCompany.street || !newCompany.postalCode) {
            setErrorMessage('Veuillez remplir tous les champs');
            return;
        }
        if (!user || !user.id) {
            return;
        }
        console.log('new company', newCompany);
        archistockApiService.createCompany(newCompany, user.id).then(
            (response) => {
                navigate('/company');
                
            }
        );
    }


    const handleImageChange = (e) => {
        setNewCompany({ ...newCompany, image: e.target.files[0] });
    };

    return (
        <div className='w-full h-4/5'>
            <div className='flex justify-between items-center'>
                <h2>Création d'une entreprise</h2>
            </div>
            <div className='flex justify-center items-center h-full'>
                <div>
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
                <Input
                    value={newCompany.postalCode}
                    onChange={(e) => setNewCompany({ ...newCompany, postalCode: e.target.value })}
                    css={'w-full mb-3'}
                    name="postalCode"
                    label="Postal Code"
                    type="text"
                    labelWeight="bold"
                    placeholder="Postal Code"
                    required={true}
                />
                <input type="file" accept="image/*" onChange={e => handleImageChange(e)} />
                <div className='flex w-full justify-between mt-5'>
                    <Button css='w-full' color='primary' onClick={() => validateForm()}>Créer</Button>
                </div>
                </div>

            </div>
        </div>
    )
}
