import React from 'react'
import { ButtonWrapper } from './ButtonStyles'

const Button = ({ children, bg, color, onClick, as, htmlFor, disabled }) => {
    return (
        <ButtonWrapper 
            $bg={bg}
            color={color}
            onClick={onClick}
            as={as}
            htmlFor={htmlFor}
            disabled={disabled}
        >
            {children}
        </ButtonWrapper>
    )
}

export default Button
