import React from 'react'
import {
    DotsThreeVertical
} from "@phosphor-icons/react";

export default function InvitationList({invitations}) {
  return (
    <div className='mt-5'>
    {
        invitations.map((invitation) => (
            <div key={invitation.id} className='user-card flex bg-white rounded p-5 drop-shadow'>
                <h3 className='w-1/4 font-medium'>{invitation?.firstName} {user?.lastName}</h3>
                <p className='w-1/4 font-light'>{user?.email}</p>
                <p className='w-2/4 font-light'>{user?.rights[0].roles}</p>
                <div className='flex items-center justify-center cursor-pointer'>
                    <DotsThreeVertical size={20} />
                </div>
            </div>
        ))
    }
</div>
  )
}
