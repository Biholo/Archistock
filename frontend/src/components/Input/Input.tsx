import React, { useEffect, useState } from 'react';
import './Input.scss';

function Input({label, labelWeight, placeholder, pattern, value, onChange, type, name, required, disabled, color, css} : {label: string, labelWeight: string, placeholder: string, pattern: string, value: string, onChange: any, type: string, name: string, required: boolean, disabled: boolean, color: string, css: string}) {

    const [state , setState] = useState('');

    useEffect(() => {
        switch(color) {
            case 'primary':
                setState('input-primary');
                break;
            case 'secondary':
                setState('input-secondary');
                break;
            case 'success':
                setState('input-success');
                break;
            case 'danger':
                setState('input-error');
                break;
            case 'error':
                setState('input-error');
                break;
            case 'warning':
                setState('input-warning');
                break;
            case 'info':
                setState('input-info');
                break;
            default:
                setState('');
        }
    }, [])

    const handleChange = (e: any) => {
        if (pattern) {
            if (!e.target.value.match(pattern)) {
                setState('input-error');
            } else {
                setState('input-success');
            }
        }
    }

    return (
       <div className={css}>
            <label className={`block text-sm mb-2 font-${labelWeight}`} htmlFor={name}>
                {label} {required ? <span className='text-red-400'>*</span> : ''}
            </label>
            <input
                className={`input input-bordered bg-white w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl ${state} ${disabled ? 'cursor-not-allowed disabled:bg-white' : ''}`}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onInput={handleChange}
                required={required}
                disabled={disabled}
            />
        </div>
    )
}

export default Input
