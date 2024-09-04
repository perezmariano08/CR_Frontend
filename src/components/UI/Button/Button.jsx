import React from 'react';
import { ButtonWrapper } from './ButtonStyles';

const Button = ({ 
    background = 'green',
    border = 'green',
    color = "black",
    disabled = false,  // Add disabled prop
    children 
}) => {
    return (
        <ButtonWrapper
            whileTap={{ scale: disabled ? 1 : 0.95 }} // Disable tap animation if button is disabled
            background={background}
            border={border}
            color={color}
            disabled={disabled}  // Pass the disabled prop
            className={disabled ? 'disabled' : ''}  // Apply the disabled class
        >
            {children}
        </ButtonWrapper>
    );
};

export default Button;
