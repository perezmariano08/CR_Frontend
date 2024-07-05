import React from 'react'
import { InputContainerStyled, InputWrapper } from './InputSyles'

const Input = ({placeholder, children, type="text", onChange, required}) => {
    return (
        <InputContainerStyled>
            {children}
            <InputWrapper type={type} placeholder={placeholder} onChange={onChange} required={required}/>
        </InputContainerStyled>
    )
}

export default Input