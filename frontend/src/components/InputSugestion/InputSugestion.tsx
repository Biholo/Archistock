import React, { useEffect, useState, ReactNode, useRef } from 'react';
import './InputSugestion.scss';

interface InputSuggestionProps {
    label?: string;
    labelWeight?: string;
    placeholder?: string;
    pattern?: string;
    value?: string;
    onSelect?: (suggestion: string) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    color?: string;
    css?: string;
    suggestions?: ReactNode[];  // Suggestions acceptant des éléments JSX
}

function InputSuggestion({
    label,
    labelWeight,
    placeholder,
    pattern,
    value,
    onSelect,
    onChange,
    type = 'text',
    name,
    required = false,
    disabled = false,
    color,
    css,
    suggestions = []
}: InputSuggestionProps) {

    const [state, setState] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSelect = (suggestion: ReactNode) => {
        if (onSelect && typeof suggestion === 'string') {
            onSelect(suggestion);
        }
        setShowSuggestions(false); // Hide suggestions after selecting one
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    return (
        <div className={`relative ${css}`} ref={wrapperRef}>
            {label && (
                <label className={`block text-sm mb-2 font-${labelWeight}`} htmlFor={name}>
                    {label} {required && <span className='text-red-400'>*</span>}
                </label>
            )}
            <input
                className={`input input-bordered bg-white w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl ${state} ${disabled ? 'cursor-not-allowed disabled:bg-white' : ''}`}
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={handleFocus} // Show suggestions when input is focused
                required={required}
                disabled={disabled}
                pattern={pattern}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list absolute w-full z-10 bg-white shadow-lg border border-gray-300">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default InputSuggestion;
