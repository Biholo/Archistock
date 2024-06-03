import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import './NewPassword.scss'
import ArchistockApiService from '../../services/ArchistockApiService';

export default function NewPassword() {
    const archistockApiService = new ArchistockApiService();
    const [newPassword, setNewPassword] = useState({
        password: '',
        passwordConfirm: '',
        currentPassword: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const chandleChangeInput = (e: any) => {
        if(error !== '') {
            setError('');
        }
        setNewPassword({
            ...newPassword,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})/;
    
        if (!passwordRegex.test(newPassword.password)) {
            setError('Le mot de passe ne respecte pas les critères suivants : il doit contenir au minimum 7 caractères, une majuscule, un chiffre et un caractère spécial.');
            return;
        }
    
        if (newPassword.password !== newPassword.passwordConfirm) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
    
        if (newPassword.password.includes('123')) {
            setError('Le mot de passe ne doit pas contenir votre pseudo ou "123"');
            return;
        }
        archistockApiService.updatePassword(newPassword.password, jwt).then((response) => {
            if (response) {
                navigate('/user/profile');
            }
        });
    }

    return (
        <div className="p-2 new-password flex flex-col items-center justify-center h-full">
            <h1 className="text-center mb">Changement de mot de passe</h1>

            <div className="main-content flex flex-col justify-center">
                <div className='my-4 criteria'>
                    <p className='mb-2'>Le nouveau mot de passe doit contenir</p>
                    <ul className="list-disc pl-6">
                        <li className="mb-2">Doit contenir au minimum 7 caractères</li>
                        <li className="mb-2">Ne doit pas contenir votre pseudo ou "123"</li>
                        <li className="mb-2">Doit contenir une majuscule, un chiffre et un caractère spécial</li>
                    </ul>
                </div>
                <Input css={'w-full mt-2'} onChange={e => chandleChangeInput(e)} type="password" name="currentPassword" label="Mot de passe actuel" value={newPassword.currentPassword}  />
                <Input css={'w-full mt-2'} onChange={e => chandleChangeInput(e)} type="password" name="password" label="Nouveau mot de passe" value={newPassword.password}  />
                <Input css={'w-full mt-2'} onChange={e => chandleChangeInput(e)} type="password" name="passwordConfirm" label="Confirmer le nouveau mot de passe" value={newPassword.passwordConfirm}  />
                <p className='error'>{error}</p>
                <button onClick={e => handleSubmit(e)} className="w-full py-2 mt-3">Valider</button>
            </div>
          
        </div>
    )
}
