import React, { useState, useEffect } from 'react'
import './ForgotPassword.scss'
import Input from '../../components/Input/Input';
import { useNavigate } from 'react-router-dom';
import ArchistockApiService from '../../services/ArchistockApiService';

export default function ForgotPassword() {

    const  archistockApiService = new ArchistockApiService();
    const [email, setEmail] = useState('');
    const [information, setInformation] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setInformation('');
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        //check que email est bien un email
        if(!emailSent) {
            if(!email.includes('@') || !email.includes('.')) {
                setInformation('Veuillez renseigner un email valide');
                return;
            }
            archistockApiService.resetPassword(email).then(
                (response) => {
                    if(response) {
                        setEmailSent(true);
                        setInformation('Un email de réinitialisation de mot de passe a été envoyé');

                    } else {
                        setInformation('Cette email est lié à aucun compte.');
                    }
                }
            );
        }
    }


    return (
       <div className='flex items-center justify-center h-full card'>
         <div className="forgot-password p-2">
            <div className="top flex flex-col items-center py-4">
                <h1>🔗Archistock</h1>
                <p>1.0.0</p>
            </div>
            <div className="main-content flex flex-col justify-center">
                <h2 className="text-center mb-5">Reset de mot de passe</h2>
           
                {
                    !emailSent ? (
                       <>
                            <Input value={email} onChange={e => handleChangeInput(e)} css={'w-full mb-3'} name="email" label="Veuillez l'email de vôtre compte" type="email" labelWeight="bold" placeholder="Veuillez renseigner votre adresse email" required={true} />
                            <p className='information'>{information}</p>
                            <button onClick={e => handleSubmit(e)} className="w-full py-2">Valider</button>
                       </>
                    ) : (
                        <p className='information-validate'>
                        L'email de réinitialisation vous a été envoyé à <span>{email}</span>
                        <br />
                        Veuillez consulter votre boîte mail.
                        </p>                    
                    )
                }
            </div>
            <div className="flex flex-col items-center py-4 bottom">
                <p className="right mt-5">archistock 2024®</p>
            </div>
        </div>
       </div>
    )
}
