import React, { useState, useEffect } from 'react';
import Input from './Input';
interface InputProps {
    label?: string;
    children?: React.ReactNode;
    labelWeight?: string;
    placeholder?: string;
    pattern?: string;
    value?: string;
    onChange?: (value: string) => void; // Update the type of onChange prop
    type?: string;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    color?: string;
    css?: string;
}
const DebouncedInput = ({
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
}: InputProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (onChange && typeof onChange === 'function') {
        onChange(debouncedSearchTerm);
      // Add logic here to handle the debounced search term
    }
  }, [debouncedSearchTerm]);

  return (
    <Input
        label={label}
        children={children}
        labelWeight={labelWeight}
        placeholder={placeholder}
        pattern={pattern}
        value={value}
        onChange={(e) => setSearchTerm(e.target.value)}
        type={type}
        name={name}
        required={required}
        disabled={disabled}
        color={color}
        css={css}
    />
  );
};

export default DebouncedInput;
