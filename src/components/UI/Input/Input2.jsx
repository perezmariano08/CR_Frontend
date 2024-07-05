import React from 'react';
import { InputContainerStyled2, InputWrapper2 } from './InputSyles';

const Input2 = ({ placeholder, children, type = "text", value, onChange, onValueChange, ref }) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e); // Pasamos el evento completo al llamar a la función onChange si está definida
        }
        if (onValueChange) {
            onValueChange(e.target.value); // Pasamos solo el valor del input al llamar a la función onValueChange si está definida
        }
    };

    return (
        <InputContainerStyled2>
            {children}
            <InputWrapper2
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </InputContainerStyled2>
    );
};

export default Input2;
