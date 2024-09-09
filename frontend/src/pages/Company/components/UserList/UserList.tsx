import { useState } from 'react'
import {
    DotsThreeVertical
} from "@phosphor-icons/react";
import { User } from '../../../../models/UserModel';
import { useAuth } from '../../../../contexts/AuthContext';

interface UserListProps {
    users: User[];
}

export default function UserList({ users }: UserListProps) {

    const { user } = useAuth();
    const [showOptions, setShowOptions] = useState<boolean | number>(false);



    return (
        <div className='mt-5'>
            <div className='flex mb-3'>
                <h3 className='w-1/4 text-sm'>Nom</h3>
                <p className='w-1/4  text-sm'>Email</p>
                <p className='w-1/4  text-sm'>Permissions sur l'oganisation</p>
            </div>
            {
                users.map((user) => (
                    <div key={user.id} className='user-card flex bg-white rounded p-5 drop-shadow mb-2'>
                        <h3 className='w-1/4 text-sm font-medium'>{user?.firstName} {user?.lastName}</h3>
                        <p className='w-1/4 text-sm font-light'>{user?.email}</p>
                        <p className='w-2/4 text-sm font-light'>{user?.rights[0].roles}</p>
                        <div className='flex items-center justify-center cursor-pointer'>
                            <DotsThreeVertical size={20} onClick={() => setShowOptions(!showOptions)} />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

