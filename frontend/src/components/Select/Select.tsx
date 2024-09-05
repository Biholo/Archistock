import React, { useEffect, useState } from 'react';

interface SelectProps {
  options: { value: string; label: string }[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  color?: string;
  css?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  onChange,
  value,
  color = 'primary',
  css = '',
  disabled = false,
}) => {
  const [state, setState] = useState('');

  useEffect(() => {
    switch (color) {
      case 'primary':
        setState('select select-primary text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'secondary':
        setState('select select-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'success':
        setState('select select-success text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'danger':
        setState('select select-danger text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'error':
        setState('select select-error text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'warning':
        setState('select select-warning text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'info':
        setState('select select-info text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
        break;
      case 'neutral':
        setState('select bg-neutral-300 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800 hover:bg-neutral-400 hover:text-black');
        break;
      default:
        setState('select select-primary text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-800');
    }
  }, [color]);

  return (
    <select
      className={`${state} ${css}`}
      onChange={onChange}
      value={value}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
