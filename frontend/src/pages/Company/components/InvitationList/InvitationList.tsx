import { useState, useEffect } from 'react'
import ArchistockApiService from '../../../../services/ArchistockApiService';
import {
    DotsThreeVertical
} from "@phosphor-icons/react";

export default function InvitationList({ invitations, userInvitations }) {
    const [paramsInvitationRequest, setParamsInvitationRequest] = useState({
        type: '',
        id: null
    });
    const archistockApiService = new ArchistockApiService();

    const toggleClickParams = (id: number, type: string) => {
        console.log('id', id);
        if (!id) return;
        if (paramsInvitationRequest.id === null) {
            setParamsInvitationRequest({
                type: type,
                id: id
            });
        } else {
            setParamsInvitationRequest({
                type: '',
                id: null
            });
        }
    }

   const cancelInvitation = (id: number) => {
        if (!id) return;
        archistockApiService.cancelInvitationRequest(id).then((response) => {
        })
    }



    return (
        <div className='mt-5'>
            <div className='flex mb-3'>
                <h3 className='w-1/4 text-sm'>Nom</h3>
                <p className='w-1/4  text-sm'>Email</p>
                <p className='w-1/4  text-sm'>Permissions sur l'oganisation</p>
            </div>
            {
                invitations.map((invitation) => (
                    <div key={invitation.id} className='user-card flex bg-white rounded p-5 drop-shadow mb-2'>
                        <h3 className='w-1/4 text-sm font-medium'>{invitation?.user?.firstName} {invitation?.user?.lastName}</h3>
                        <p className='w-1/4 text-sm font-light'>{invitation?.user?.email}</p>
                        <p className='w-2/4 text-sm font-light'>{invitation?.acceptedRole}</p>
                        <div className='relative flex items-center justify-center cursor-pointer'>
                            <DotsThreeVertical size={20} onClick={() => toggleClickParams(invitation.id, 'invitation')} />
                            {
                               ( paramsInvitationRequest?.id === invitation.id && paramsInvitationRequest?.type === 'invitation') && (
                                    <div className='absolute bottom-[25px] right-0 bg-grey-500 shadow rounded'>
                                        <button className='cursor-pointer text-sm px-2 py-1'>Annuler</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ))
            }
            {
                userInvitations.map((invitation) => (
                    <div key={invitation.id} className='user-card flex bg-white rounded p-5 drop-shadow mb-2'>
                        <h3 className='w-1/4'><span className='font-light text-sm px-3 bg-red-400/[0.5] outline-red-500 outline rounded-full outline-1'>Pending</span></h3>
                        <p className='w-1/4 text-sm font-light'>{invitation?.invitedEmail}</p>
                        <p className='w-2/4 text-sm font-light'>{invitation?.acceptedRole}</p>
                        <div className='relative flex items-center justify-center cursor-pointer'>
                            <DotsThreeVertical size={20} onClick={() => toggleClickParams(invitation.id, 'user-invitation')} />
                            {
                               ( paramsInvitationRequest?.id === invitation.id && paramsInvitationRequest?.type === 'user-invitation') && (
                                    <div className='absolute bottom-[25px] right-0 bg-grey-500 shadow rounded'>
                                        <button className='cursor-pointer text-sm px-2 py-1'>Annuler</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
