import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/Button/Button';
import ArchistockApiService from '../../../../services/ArchistockApiService';
import { useAuth } from '../../../../contexts/AuthContext';

import {
    Bell
} from "@phosphor-icons/react";

export default function IndexCompagnies({ companies, updateCompanies }) {

    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();
    const [invitationsReceived, setInvitationsReceived] = useState([]);
    const [showInvitations, setShowInvitations] = useState(false);
    const { user } = useAuth();

    const openCompany = (id) => {
        navigate(`/company/detail/${id}`);
    }


    useEffect(() => {
        archistockApiService.getInvitationRequestByUserId(user?.id).then((response) => {            setInvitationsReceived(response);
        })
    }, [])

    const acceptInvitation = (id: number) => {
        if(!id) return;
        archistockApiService.acceptInvitationRequest(id).then((response) => {
            setInvitationsReceived(invitationsReceived.filter((invitation) => invitation.id !== id));
            updateCompanies();
        })
    }

    const declineInvitation = (id: number) => {
        if(!id) return;
        archistockApiService.declineInvitationRequest(id).then((response) => {
            setInvitationsReceived(invitationsReceived.filter((invitation) => invitation.id !== id));
        })
    }


    return (
        <div className='index-companies'>
            <div className='flex justify-between items-center'>
                <h2>Vos entreprises</h2>
                <div className='flex items-center'>
                    <Button css="mr-3" onClick={() => navigate('/company/no-company')}>Ajouter une entreprise</Button>
                    <div className='relative'>
                        <Bell onClick={() => setShowInvitations(!showInvitations)} className='primary cursor-pointer' size={35} />
                        { invitationsReceived.length !== 0 && <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center'>{invitationsReceived.length}</div>}
                        {
                            showInvitations && (
                                <div className='absolute right-0 w-[600px]'>
                                    <ul className='flex  flex-col w-full bg-white shadow rounded p-4 mt-4'>
                                        {
                                            invitationsReceived.map((invitation) => (
                                                <li key={invitation?.id} className='flex items-center justify-between mb-2'>
                                                    <div className='flex items-center justify-between w-full'>
                                                        <p>L'entrerpise <strong>{invitation.company.name}</strong> vous a invité à les rejoindre</p>
                                                        <div>
                                                            <button onClick={() => acceptInvitation(invitation?.id)} className='rounded shadow px-2 bg-green-500 mr-2'>Accepter</button>
                                                            <button onClick={() => declineInvitation(invitation?.id)} className='rounded shadow px-2 bg-red-500'>Refuser</button>
                                                        </div>
                                                    </div>
                                                    
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            )
                        }
                    </div>
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
