import React from 'react'
import { InputContainerStyled, InputWrapper } from './InputSyles'
import { HiEye } from 'react-icons/hi2'

const InputPassword = ({children, placeholder}) => {
    return (
        <InputContainerStyled>
            {children}
            <InputWrapper type="password" placeholder={placeholder}></InputWrapper>
            <HiEye/>
        </InputContainerStyled>
    )
}

export default InputPassword