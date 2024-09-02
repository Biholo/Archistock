import React, { useEffect, useState } from 'react';
import { CheckCircle } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode"; // Import corrected
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { useParams } from 'react-router-dom';
import ArchistockApiService from '../../services/ArchistockApiService';

export default function ConfirmAccount() {
    const archistockApiService = new ArchistockApiService();
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const [isTokenValid, setIsTokenValid] = useState(false);
    const { jwt } = useParams();

    useEffect(() => {
        if (jwt) {
            try {
                const decodedToken = jwtDecode(jwt);
                console.log('Decoded jwt:', decodedToken);

                const currentTime = Date.now() / 1000;
                if (decodedToken && decodedToken.exp && decodedToken.exp > currentTime) {
                    setIsTokenValid(true);
                    
                    // Confirmer le compte
                    archistockApiService.confirmAccount(jwt).then((res) => {
                        console.log(res);
                    });
                    
                    // Rediriger après 5 secondes
                    setTimeout(() => {
                        navigate('/profile');
                    }, 5000);
                }
            } catch (error) {
                console.error('jwt decoding failed', error);
            }
        }
    }, [jwt, location, navigate]); // include navigate in dependency array

    if (!isTokenValid) {
        return (
            <div className='flex items-center justify-center h-full'>
                <div className='bg-red-600 text-white p-4 rounded-md shadow flex items-center'>
                    <CheckCircle size={32} className='mr-3' />
                    Le lien de confirmation est invalide ou a expiré.
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center h-full'>
            <div className='bg-green-600 text-white p-4 rounded-md shadow flex items-center'>
                <CheckCircle size={32} className='mr-3' />
                Compte confirmé avec succès !
            </div>
        </div>
    );
}
