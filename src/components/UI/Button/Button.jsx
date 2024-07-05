import React from 'react'
import { ButtonWrapper } from './ButtonStyles'

const Button = ({ 
    background = 'green',
    border = 'green',
    color = "black",
    children }) => {
    return (
        <ButtonWrapper
            whileTap={{scale: .95}}
            background={background}
            border={border}
            color={color}
        >
            {children}
        </ButtonWrapper>
    )
}

export default Button