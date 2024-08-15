import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import ArchistockApiService from '../../../../services/ArchistockApiService';
import UserList from '../UserList/UserList';
import StockageList from '../StockageList/StockageList';
import InvitationList from '../InvitationList/InvitationList';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input/Input';

import {
    Cloud,
    Plus,
    X
} from "@phosphor-icons/react";
export default function Parameter() {

    const { id } = useParams();
    const { user } = useAuth();
    const archistockApiService = new ArchistockApiService();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [userInvitations, setUserInvitations] = useState([]);
    const [sharedStorageSpaces, setSharedStorageSpaces] = useState([]);
    const [company, setCompany] = useState(null);
    const [page, setPage] = useState('users');

    const [inviteUsers, setInviteUsers] = useState([]);
    const [searchEmail, setSearchEmail] = useState({
        email: '',
        permission: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isShowInvite, setIsShowInvite] = useState(false);

    useEffect(() => {
        if (user && user.id && id) {
            setLoading(true); // Démarre le chargement
            archistockApiService.findAllInfosByCompanyId(id, user.id).then(
                (response: any) => {
                    console.log(response);
                    setCompany(response.company);
                    setUsers(response.users);
                    setInvitations(response.invitationRequests);
                    setSharedStorageSpaces(response.sharedStorageSpaces);
                    setUserInvitations(response.userInvitations);
                    setLoading(false);
                }
            ).catch((error) => {
                console.error("Erreur lors de la récupération de l'entreprise :", error);
                setLoading(false);
            });
        }
    }, [id, user]);

    const handleInviteUser = () => {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

        if (searchEmail.email) {
            // Vérifie si l'email a un format valide
            if (emailRegex.test(searchEmail.email)) {
                if(!searchEmail.permission) {
                    setErrorMessage('Veuillez choisir une permission.');
                    return;
                }
                // Vérifie si l'email est déjà dans la liste
                if (!inviteUsers.some(user => user.email === searchEmail.email)) {
                    setInviteUsers([...inviteUsers, searchEmail]);
                    setSearchEmail({ email: '', permission: null });
                    setErrorMessage('');
                } else {
                    setErrorMessage('Email déjà ajouté.');
                }
            } else {
                setErrorMessage('Email invalide.');
            }
        }
    };

    const handleEmailChange = (e) => {
        setSearchEmail({ ...searchEmail, email: e.target.value });
        setErrorMessage('');
    };

    const removeEmail = (email) => {
        setInviteUsers(inviteUsers.filter(user => user.email !== email));
        setErrorMessage('');
        setSearchEmail({ email: '', permission: null });
    };

    const closeInviteCard = () => {
        setIsShowInvite(false);
        setInviteUsers([]);
        setSearchEmail({ email: '', permission: null });
        setErrorMessage('');
    }

    const submitInvitations = () => {
        if(!user || !user.id) {
            setErrorMessage('Erreur lors de la récupération de l\'utilisateur.');
            return;
        }
        if(!id) {
            setErrorMessage('Erreur lors de la récupération de l\'entreprise.');
            return;
        }
        if(inviteUsers.length === 0) {
            setErrorMessage('Veuillez ajouter des utilisateurs.');
            return;
        }
        if(!inviteUsers.every(user => user.permission)) {
            setErrorMessage('Veuillez choisir une permission pour chaque utilisateur.');
            return;
        }
        setErrorMessage('');
        archistockApiService.submitInvitationsToCompany(user.id, inviteUsers, id)
            
    }
    


    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div style={styles.loader}></div>
                <p>Chargement...</p>
            </div>
        );
    }

    const renderPage = () => {
        switch (page) {
            case 'users':
                return <UserList users={users} />;
            case 'stockages':
                return <StockageList sharedStorageSpaces={sharedStorageSpaces} />;
            case 'invitations':
                return <InvitationList invitations={invitations} userInvitations={userInvitations}/>;
            default:
                return <UserList users={users} />;
        }
    }



    return (
        <div className='parameter'>
            {/* Card Absolute */}
            {
                isShowInvite && (
                    <div className='bg-card-invitation flex items-center justify-center'>
                        <div className='card-invitation bg-white p-10 rounded w-2/5 relative'>
                            <X className='close-icon' size={28} onClick={() => closeInviteCard()} />
                            <div>
                                <h3 className='font-semibold text-lg'>Inviter des utilisateurs</h3>
                                <p className='my-4 font-light text-sm'>Inviter un ou plusieurs utilisateurs dans votre entreprise</p>
                                <div className='flex flex-col'>
                                    <div className='flex items-end'>
                                        <Input
                                            css="w-full mr-5"
                                            value={searchEmail.email}
                                            onChange={e => handleEmailChange(e)}
                                            label="Adresse email"
                                            placeholder="Email"
                                        />
                                        <Button css='' onClick={handleInviteUser}>
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                    <p className='text-red-500 text-center text-xs mt-2'>{errorMessage}</p>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <h4 className='mb-3 font-medium'>Permissions sur l'organisation</h4>
                                <div>
                                    <div className='flex items-center mb-2'>
                                        <input
                                            className='mr-3'
                                            type='radio'
                                            name='role'
                                            value='admin'
                                            onChange={() => setSearchEmail({ ...searchEmail, permission: 'admin' })}
                                            checked={searchEmail.permission === 'admin'}
                                        />
                                        <p>Admin</p>
                                    </div>
                                    <div className='flex items-center mb-2'>
                                        <input
                                            className='mr-3'
                                            type='radio'
                                            name='role'
                                            value='manager'
                                            onChange={() => setSearchEmail({ ...searchEmail, permission: 'manager' })}
                                            checked={searchEmail.permission === 'manager'}
                                        />
                                        <p>Manager</p>
                                    </div>
                                    <div className='flex items-center mb-2'>
                                        <input
                                            className='mr-3'
                                            type='radio'
                                            name='role'
                                            value='employee'
                                            onChange={() => setSearchEmail({ ...searchEmail, permission: 'employee' })}
                                            checked={searchEmail.permission === 'employee'}
                                        />
                                        <p>Employé</p>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <div className='flex items-center justify-between'>
                                    <p className='font-medium'>{inviteUsers.length} Users</p>
                                    <p className='text-sm text-sky-500 cursor-pointer' onClick={() => setInviteUsers([])}>Clear all</p>
                                </div>
                                <div className='flex flex-wrap mt-3'>
                                    {
                                        inviteUsers.map((user, index) => (
                                            <div key={index} className='flex items-center mb-2 bg-slate-200 py-1 px-3 rounded-full mr-2'>
                                                <p className='mr-3 text-sm'>{user.email}</p> {/* Accès à la propriété email */}
                                                <X className='cursor-pointer' size={15} onClick={() => removeEmail(user.email)} />
                                            </div>
                                        ))
                                    }
                                </div>


                            </div>
                            <p className='font-light text-xs mt-2'>Note : Si le ou les emails que vous invitez sont déjà enregistrés, leurs utilisateurs pourront rejoindre l'entreprise via une invitation sur leur interface. Dans le cas contraire, un email de création de compte leur sera envoyé.</p>

                            <div className='flex justify-end items-center mt-5'>
                                <Button css='w-1/5 mr-3' color='neutral' onClick={() => closeInviteCard()}>
                                    Annuler
                                </Button>
                                <Button css='w-full w-4/5' onClick={() => submitInvitations()}>
                                    Envoyer l'invitation
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }

            <div className='flex justify-between'>
                <h2>Paramètres de l'entreprise {company?.name}</h2>
                <div className='flex items-center'>
                    <Button css="mr-3" onClick={() => setIsShowInvite(true)}>
                        Ajouter un utilisateur
                    </Button>
                    <Button css="mr-3">
                        <Cloud size={40} />
                    </Button>
                </div>
            </div>
            <ul className='flex mt-2'>
                <li onClick={e => setPage('stockages')} className={`mr-5 ${page === 'stockages' ? 'selected' : ''}`}>Stockages</li>
                <li onClick={e => setPage('users')} className={`mr-5 ${page === 'users' ? 'selected' : ''}`}>Utilisateurs</li>
                <li onClick={e => setPage('invitations')} className={`${page === 'invitations' ? 'selected' : ''}`}>Invitations</li>
            </ul>
            <div>
                {renderPage()}
            </div>
        </div>
    )
}


const styles = {
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loader: {
        border: '16px solid #f3f3f3', /* Light grey */
        borderTop: '16px solid #3498db', /* Blue */
        borderRadius: '50%',
        width: '120px',
        height: '120px',
        animation: 'spin 2s linear infinite',
    },
};

// Ajoutez les styles pour l'animation de rotation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`, styleSheet.cssRules.length);
