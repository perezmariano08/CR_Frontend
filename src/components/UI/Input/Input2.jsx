import React from 'react';
import { InputContainerStyled2, InputWrapper2 } from './InputSyles';

const Input2 = ({ placeholder, children, type = "text", value, onChange, onValueChange, ref, numeric = false }) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e);
        }
        if (onValueChange) {
            onValueChange(e.target.value);
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
                inputMode={numeric ? "numeric" : "text"}
            />
        </InputContainerStyled2>
    );
};

export default Input2;
