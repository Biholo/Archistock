import React, {useState} from 'react';
import CardPricing from '../../components/CardPricing/CardPricing';
import './Pricing.scss';

export default function Pricing() {

    const [state, setState] = useState('particular');

    

    return (
        <div className='h-screen justify-center flex flex-col pricing'>
            <div className='flex flex-col justfiy-center items-center mb-5'>
                <h1 className='text-4xl font-extrabold text-center'>Pricing</h1>
                <p className='text-center text-gray-600 my-3'>Choose the best plan for your business</p>
                <div className='flex justify-center rounded-full shadow cursor-pointer' style={{ background: 'rgba(255, 255, 255, 0.4)'}}>
                    <h6 className={`px-5 text-medium rounded-full ${state === 'particular' ? 'selected' : ''}`} onClick={() =>  setState('particular')}>Particular</h6>
                    <h6 className={`px-5 text-medium rounded-full ${state === 'company' ? 'selected' : ''}`} onClick={() =>  setState('company')}>Company</h6>
                </div>
            </div>
            <div className='flex items-center justify-center space-x-4'>
                <CardPricing
                    name='Basic'
                    price={19}
                    features={['Unlimited users', 'Unlimited data', 'Unlimited storage']}
                    mainColor='rgba(255, 255, 255, 0.4)'
                    secondaryColor='#134462'
                />
                <CardPricing
                    name='Standard'
                    price={29}
                    features={['Unlimited users', 'Unlimited data', 'Priority support']}
                    mainColor='#134462'
                    secondaryColor='rgba(255, 255, 255, 1)'
                    large={true}
                />
                <CardPricing
                    name='Premium'
                    price={39}
                    features={['text', 'Unlimited users', 'Unlimited data', 'Dedicated support']}
                    mainColor='rgba(255, 255, 255, 0.4)'
                    secondaryColor='#134462'
                />
            </div>
        </div>
    )
}
