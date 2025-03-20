import React, { useState } from 'react';
import { InputContainerStyled2, InputWrapper2, LoaderIconWrapper } from './InputSyles';
import { LoaderIcon } from 'react-hot-toast';

const Input2 = ({ 
    placeholder, 
    children, 
    type, 
    value, 
    onChange, 
    onValueChange, 
    onBlur, 
    numeric, 
    disabled, 
    loading, 
    error, 
    success 
}) => {
    const [touched, setTouched] = useState(false);  // Nuevo estado

    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
        if (onValueChange) {
            onValueChange(e.target.value);
        }
    };

    const handleBlur = (e) => {
        setTouched(true); // Marcar el input como interactuado (touched) al hacer blur
        if (onBlur) {
            onBlur(e);
        }
    };

    // Definir las clases condicionales basadas en si se ha interactuado (touched)
    const inputClass = touched && error 
        ? 'error' 
        : touched && success 
        ? 'success' 
        : '';

    return (
        <InputContainerStyled2>
            {children}
            <InputWrapper2
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                className={inputClass}
                autoFocus 
            />
            {loading && (
                    <LoaderIcon />
            )}
        </InputContainerStyled2>
    );
};

export default Input2;
