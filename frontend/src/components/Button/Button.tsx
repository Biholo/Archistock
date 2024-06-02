import React, { useEffect, useState } from 'react';

function Button({label, onClick, color} : {label: string, onClick: any, color: string}) {

    const [state, setState] = useState('');

    useEffect(() => {
        switch(color) {
            case 'primary':
                setState('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded');
                break;
            case 'secondary':
                setState('bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded');
                break;
            case 'success':
                setState('bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded');
                break;
            case 'danger':
                setState('bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded');
                break;
            case 'warning':
                setState('bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded');
                break;
            case 'info':
                setState('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded');
                break;
            default:
                setState('bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded');
        }
    }, []);

    return (
        <React.Fragment>
            <button className={state} onClick={onClick}>
                {label}
            </button>
        </React.Fragment>
    )
}

export default Button
