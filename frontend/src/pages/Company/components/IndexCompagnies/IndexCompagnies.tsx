import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';

export default function IndexCompagnies( {companies}) {

    const navigate = useNavigate();
    useEffect(() => {
        console.log('companies', companies);
    }
    , [companies]);

    const openCompany = (id) => {
        navigate(`/detail/${id}`);
    }

  return (
    <div>
        <div>
            <h1>Vos entreprises</h1>
            <Button onClick={e => navigate('/company/no-company')}>Ajouter une entreprise</Button>
        </div>
        <div>
        {
            companies.map((company) => (
                <div key={company.id} className='company-card' onClick={e => openCompany(company.id)}>
                    <h3>{company.name}</h3>
                    <p>{company.description}</p>
                </div>
            ))
        }
        </div>
    </div>
  )
}
