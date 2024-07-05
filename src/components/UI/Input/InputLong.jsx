import React from 'react';
import { InputContainerStyled, InputWrapper } from './InputSyles';

const InputLong = ({ id, name, placeholder, children, type = "text" }) => {
    return (
        <InputContainerStyled>
            {children}
            <InputWrapper id={id} name={name} type={type} placeholder={placeholder} />
        </InputContainerStyled>
    );
};

export default InputLong;
