import React from 'react'
import { InputContainerStyled, InputWrapper } from './InputSyles'
import { HiEye } from 'react-icons/hi2'

const InputPassword = ({children, placeholder, id, name}) => {
    return (
        <InputContainerStyled>
            <InputWrapper 
                type="password" 
                placeholder={placeholder} 
                id={id}
                name={name}>
            </InputWrapper>
            <HiEye/>
        </InputContainerStyled>
    )
}

export default InputPassword