import React, { useState, forwardRef } from 'react';
import { InputContainerStyled, InputWrapper } from './InputSyles';
import { AiOutlineEye, AiFillEyeInvisible } from 'react-icons/ai';

const Input = forwardRef(({ placeholder, type = "text", icon, className, isError, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <InputContainerStyled>
            <InputWrapper
                ref={ref}
                type={showPassword ? "text" : type}
                placeholder={placeholder}
                className={className}
                {...props} // Pasar todos los props al campo de entrada
            />
            {icon}
            {type === 'password' && (
                <div className='hi-eye' onMouseDown={togglePasswordVisibility}>
                    {showPassword ? <AiOutlineEye /> : <AiFillEyeInvisible className='eye-off'/>}
                </div>
            )}
            {isError && <span>Este campo es obligatorio</span>}
        </InputContainerStyled>
    );
});

export default Input;
