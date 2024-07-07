import React, { ReactNode, useEffect, useState } from 'react';

function Button({children, onClick, color, css, disabled} : {children: ReactNode, onClick?: any, color?: string, css: string, disabled?: boolean}) {

    const [state, setState] = useState('');

    useEffect(() => {
        
        switch(color) {
            // tailwind daisyui colors
            case 'primary':
                setState('btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'secondary':
                setState('btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'success':
                setState('btn btn-success disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'danger':
                setState('btn btn-danger disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'error':
                setState('btn btn-error disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'warning':
                setState('btn btn-warning disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            case 'info':
                setState('btn btn-info disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
                break;
            default:
                setState('btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
            
        }
    }, []);

    return (
        <React.Fragment>
            <button className={state + " " + css} onClick={onClick} disabled={disabled}>
                {children}
            </button>
        </React.Fragment>
    )
}

export default Button
