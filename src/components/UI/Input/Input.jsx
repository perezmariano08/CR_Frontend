import React, { useState, forwardRef } from 'react';
import { InputContainerStyled, InputWrapper } from './InputSyles';
import { AiOutlineEye, AiFillEyeInvisible } from 'react-icons/ai';

const Input = forwardRef(({ placeholder, type = "text", icon, className, isError, name, value, onChange, errorMessage, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <InputContainerStyled className={className}>
            <InputWrapper
                name={name}
                ref={ref}
                type={inputType}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                {...props} // Pasar todos los props al campo de entrada
            />
            {icon && <div className='icon-container'>{icon}</div>}
            {type === 'password' && (
                <div className='hi-eye' onMouseDown={togglePasswordVisibility} role="button" aria-label="Toggle Password Visibility">
                    {showPassword ? <AiOutlineEye /> : <AiFillEyeInvisible className='eye-off' />}
                </div>
            )}
            {isError && <span className='error-message'>{errorMessage}Hola</span>}
        </InputContainerStyled>
    );
});

export default Input;
