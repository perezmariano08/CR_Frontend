import React from 'react';
import { InputAreaWrapper, InputContainerStyled, InputWrapper } from './InputSyles';

const InputLong = ({ id, name, placeholder, children, type = "text", value, onChange }) => {
    return (
        <InputContainerStyled>
            {children}
            <InputAreaWrapper 
                id={id} 
                name={name} 
                type={type} 
                placeholder={placeholder}  
                value={value} 
                onChange={onChange} 
            />
        </InputContainerStyled>
    );
};

export default InputLong;
