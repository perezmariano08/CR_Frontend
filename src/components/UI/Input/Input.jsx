import React, { useState, forwardRef } from 'react';
import { InputContainerStyled, InputWrapper } from './InputSyles';
import { AiOutlineEye, AiFillEyeInvisible } from 'react-icons/ai';

const Input = forwardRef(({ placeholder, type = "text", icon, className, isError, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <InputContainerStyled className={className}>
            <InputWrapper
                ref={ref}
                type={inputType}
                placeholder={placeholder}
                {...props} // Pasar todos los props al campo de entrada
            />
            {icon && <div className='icon-container'>{icon}</div>}
            {type === 'password' && (
                <div className='hi-eye' onMouseDown={togglePasswordVisibility} role="button" aria-label="Toggle Password Visibility">
                    {showPassword ? <AiOutlineEye /> : <AiFillEyeInvisible className='eye-off' />}
                </div>
            )}
            {isError && <span className='error-message'>Este campo es obligatorio</span>}
        </InputContainerStyled>
    );
});

export default Input;
