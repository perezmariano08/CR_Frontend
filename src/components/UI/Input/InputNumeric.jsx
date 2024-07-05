import React from 'react';
import PropTypes from 'prop-types';
import { InputContainerStyled2, InputWrapper2 } from './InputSyles';

const InputNumeric = ({ placeholder, children, value, onChange, onValueChange }) => {
    const handleChange = (e) => {
        const inputValue = e.target.value;
        // Validar que el valor ingresado solo contenga números
        if (/^\d*$/.test(inputValue) || inputValue === '') {
            if (onChange) {
                onChange(e); // Pasamos el evento completo al llamar a la función onChange si está definida
            }
            if (onValueChange) {
                onValueChange(inputValue); // Pasamos solo el valor del input al llamar a la función onValueChange si está definida
            }
        }
    };

    return (
        <InputContainerStyled2>
            {children}
            <InputWrapper2 
                type="text" 
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </InputContainerStyled2>
    );
};

InputNumeric.propTypes = {
    placeholder: PropTypes.string,
    children: PropTypes.node,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onValueChange: PropTypes.func
};

export default InputNumeric;
