import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importation de useParams pour récupérer les paramètres de l'URL
import Tools from '../../tools/tools';
import Input from '../../components/Input/Input';
import './ResetPassword.scss';
import ArchistockApiService from '../../services/ArchistockApiService';

interface DecodedToken {
    // Définissez les propriétés de votre token décodé ici
    userId: string;
    exp: number;
    iat: number;
    // Ajoutez d'autres propriétés au besoin
}

export default function ResetPassword() {
    const tools = new Tools();
    const archistockApiService = new ArchistockApiService();
    const navigate = useNavigate();
    const { jwt } = useParams<{ jwt: string }>();
    const [tokenAvailable, setTokenAvailable] = useState(true);
    const [resetPassword, setResetPassword] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const decodedJwt = tools.decodeJWT(jwt);
        if (!decodedJwt || decodedJwt.exp < Date.now() / 1000) {
            setTokenAvailable(false);
        }
    }, [jwt]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetPassword({
            ...resetPassword,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/;
    
        if (!passwordRegex.test(resetPassword.password)) {
            setError('Le mot de passe ne respecte pas les critères suivants : il doit contenir au minimum 7 caractères, une majuscule, un chiffre et un caractère spécial.');
            return;
        }
    
        if (resetPassword.password !== resetPassword.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
    
        if (resetPassword.password.includes('123')) {
            setError('Le mot de passe ne doit pas contenir votre pseudo ou "123"');
            return;
        }
        archistockApiService.updatePassword(resetPassword.password, jwt).then((response) => {
            if (response) {
                navigate('/login');
            }
        });
    }
    


    return (
        <div className='reset-password flex items-center justify-center'>
            {tokenAvailable ? (
                <div className="card p-2">
                    <div className="top flex flex-col items-center py-4">
                        <h1>🔗Archistock</h1>
                        <p>1.0.0</p>
                    </div>
                    <div className="main-content flex flex-col justify-center">
                        <h2 className="text-center mb">Changement de mot de passe</h2>
                        <div className='my-4 criteria'>
                            <p className='mb-2'>Le nouveau mot de passe doit contenir</p>
                            <ul className="list-disc pl-6">
                                <li className="mb-2">Doit contenir au minimum 7 caractères</li>
                                <li className="mb-2">Ne doit pas contenir votre pseudo ou "123"</li>
                                <li className="mb-2">Doit contenir une majuscule, un chiffre et un caractère spécial</li>
                            </ul>
                        </div>
                        <Input value={resetPassword.password} onChange={e => handleChangeInput(e)} css={'w-full mb-3'} name="password" label="Nouveau mot de passe" type="password" labelWeight="bold" placeholder="Veuillez renseigner votre mot de passe" required={true} />
                        <Input value={resetPassword.passwordConfirm} onChange={e => handleChangeInput(e)} css={'w-full mb-3'} name="passwordConfirm" label="Confirmer nouveau le mot de passe" type="password" labelWeight="bold" placeholder="Veuillez renseigner à nouveau votre mot de passe" required={true} />
                        <p>{error}</p>
                        <button onClick={e => handleSubmit(e)} className="w-full py-2">Valider</button>
                    </div>
                    <div className="flex flex-col items-center py-4 bottom">
                        <p className="right mt-5">archistock 2024®</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Invalid Token</h1>
                    <p>The token is invalid or has expired</p>
                </div>
            )}
        </div>
    );
}
