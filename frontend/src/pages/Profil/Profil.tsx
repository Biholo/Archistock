import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Profil.scss'
import { useAuth } from '../../contexts/AuthContext'
import Input from '../../components/Input/Input';

export default function Profil() {
    const { user } = useAuth();
    const [profileUser, setProfileUser] = useState<any>({});
    const navigate = useNavigate();


    useEffect(() => {   
        setProfileUser(user);
        console.log(user);
    }, [user]);

    const capitalizeFirstLetter = (string: string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleCLickOnNewPassword = () => {
        navigate('/profile/change-password')
    }

   

  return (
    <div className='profile p-5'>
        <h1>
            {capitalizeFirstLetter(profileUser?.firstName || '')} {capitalizeFirstLetter(profileUser?.lastName || '')}
        </h1>
        <div className='flex flex-col'>
            <div className="user-informations w-2/5 mt-2">
                <h2>Informations personnelles</h2>
                <div >
                    <div className='flex w-full'>
                        <Input css={'w-1/2 mr-2'} label="Prénom" value={profileUser?.firstName} disabled={true} />
                        <Input css={'w-1/2 ml-2'} label="Nom" value={profileUser.lastName} disabled={true} />
                    </div>
                    <Input css={'w-full mt-2'} label="Email" value={profileUser.email} disabled={true} />
                    <Input css={'w-full mt-2'} label="Téléphone" value={profileUser.phoneNumner} disabled={true} />
                
                    <button className='w-full p-3 mt-2' onClick={e => handleCLickOnNewPassword()}>Changer de mot de passe</button>
                </div>

            </div>
            <div className="address-informations w-2/5 mt-2">
                <h2>Adresse et coordonnées de facturation</h2>
                <div>
                    <Input css={'w-full mt-2'} label="Adresse" value={profileUser?.address?.street} disabled={true} />
                    <Input css={'w-full mt-2'} label="Code postal" value={profileUser?.address?.postalCode} disabled={true} />
                    <Input css={'w-full mt-2'} label="Ville" value={profileUser?.address?.city} disabled={true} />
                    <Input css={'w-full mt-2'} label="Pays" value={profileUser?.address?.country} disabled={true} />
                </div>


            </div>
        </div>
        
    </div>
  )
}
