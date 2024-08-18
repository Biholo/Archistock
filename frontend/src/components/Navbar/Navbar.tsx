import React from 'react'

export default function Navbar() {
  return (
    <nav className='flex py-5 bg-[#CBE3FF] justify-between items-center px-10 w-full fixed'>
        <div className='flex items-center'>
            <img className='w-[30px]' src="/images/logo.png" alt="" />
            <h1 className='text-2xl font-bold'>Archistock</h1>
        </div>
        <ul className='flex'>
            <li className='mr-4'>Accueil</li>
            <li className='mr-4'>Prix</li>
            <li className='mr-4'>API</li>
            <li className='mr-4'>Login</li>
            <li className='bg-[#3794C5] py-1 px-3 rounded'>Sign Up</li>
        </ul>
    </nav>
  )
}
