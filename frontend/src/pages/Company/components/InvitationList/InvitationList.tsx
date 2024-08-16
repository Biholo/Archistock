import React from 'react'
import {
    DotsThreeVertical
} from "@phosphor-icons/react";

export default function InvitationList({ invitations, userInvitations }) {
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
                        <div className='flex items-center justify-center cursor-pointer'>
                            <DotsThreeVertical size={20} />
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
                        <div className='flex items-center justify-center cursor-pointer'>
                            <DotsThreeVertical size={20} />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
