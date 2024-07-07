import React, { useEffect, useState, Fragment } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';

const PurchaseModal = ({ show, subscription, onPurchase } : any) => {

    const [display, setDisplay] = useState(show ? 'block' : 'hidden');
    const [formData, setFormData] = useState({
        fullName: '',
        expirationDate: '',
        cardNumber: '',
        cvv: ''
    });

    useEffect(() => {
        setDisplay(show ? 'block' : 'hidden');
    }, [show]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(formData.fullName && formData.cardNumber && formData.expirationDate && formData.cvv) {
            onPurchase();
        } else {
            alert('Please fill in all the fields');
        }
    };

    return (
        <Fragment>
            <div className={`fixed z-10 inset-0 overflow-y-auto ${display}`}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <form className="mt-3 text-center sm:mt-0 sm:text-left w-full" onSubmit={handleSubmit}>
                                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                        Purchase {subscription.name} Subscription
                                    </h3>
                                    <hr className='m-3'/>
                                    <div className='flex flex-col mt-3'>
                                        <p>Card information</p>
                                        <Input 
                                            type='text' 
                                            placeholder='John Doe' 
                                            css='mt-2 w-full' 
                                            label='Full Name' 
                                            name='fullName'
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required={true} 
                                        />
                                        <Input 
                                            type='text' 
                                            placeholder='1234 5678 9101 1121' 
                                            css='mt-2 w-full' 
                                            label='Card Number' 
                                            name='cardNumber'
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            required={true} 
                                        />
                                        <div className='flex flex-row flex-wrap gap-2 w-full'>
                                            <Input 
                                                type='text' 
                                                placeholder='MM/YY' 
                                                css='mt-2 w-full' 
                                                label='Expiration Date' 
                                                name='expirationDate'
                                                value={formData.expirationDate}
                                                onChange={handleChange}
                                                required={true} 
                                            />
                                            <Input 
                                                type='text' 
                                                placeholder='123' 
                                                css='mt-2 w-full' 
                                                label='CVV' 
                                                name='cvv'
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                required={true} 
                                            />
                                        </div>
                                    </div>
                                    <hr className='m-3'/>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            You are about to purchase the {subscription.name} subscription for {subscription.price} €
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <Button color="success" css="ml-3" onClick={() => { handleSubmit}} disabled={!(formData.fullName && formData.cardNumber && formData.expirationDate && formData.cvv)}>Purchase</Button>
                                        <Button color="secondary" css="ml-3" onClick={() => setDisplay('hidden')}>Cancel</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default PurchaseModal;
