import React, { useEffect, useState } from 'react';
import './Input.scss';

interface InputProps {
    label?: string;
    children?: React.ReactNode;
    labelWeight?: string;
    placeholder?: string;
    pattern?: string;
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
    type?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    color?: string;
    css?: string;
}

function Input({
    label,
    children,
    labelWeight,
    placeholder,
    pattern,
    value,
    onChange,
    type,
    name,
    required,
    disabled,
    color,
    css
}: InputProps) {
    const [state, setState] = useState('');

    useEffect(() => {
        switch (color) {
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
    }, [color]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (pattern && e.target.value && !new RegExp(pattern).test(e.target.value)) {
            setState('input-error');
        } else {
            setState('input-success');
        }
        if (onChange) onChange(e);
    };

    if (type === 'select') {
        return (
            <div className={css}>
                <label className={`block text-sm mb-2 font-${labelWeight}`} htmlFor={name}>
                    {label} {required ? <span className='text-red-400'>*</span> : ''}
                </label>
                <select
                    className={`input input-bordered bg-white w-full shadow-sm ${state} ${disabled ? 'cursor-not-allowed disabled:bg-white' : ''}`}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                >
                    {children}
                </select>
            </div>
        );
    }

    return (
        <div className={css}>
            <label className={`block text-sm mb-2 font-${labelWeight}`} htmlFor={name}>
                {label} {required ? <span className='text-red-400'>*</span> : ''}
            </label>
            <input
                className={`input input-bordered bg-white w-full shadow-sm ${state} ${disabled ? 'cursor-not-allowed disabled:bg-white' : ''}`}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                required={required}
                disabled={disabled}
            />
        </div>
    );
}

export default Input;
