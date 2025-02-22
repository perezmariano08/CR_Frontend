import React, { useState, forwardRef } from 'react';
import { InputContainerStyled, InputWrapper, TextAreaWrapper } from './InputSyles';
import { AiOutlineEye, AiFillEyeInvisible } from 'react-icons/ai';
import { InputTextarea } from 'primereact/inputtextarea';

const Input = forwardRef(({ step, placeholder, type = "text", icon, className, isError, name, value, onChange, errorMessage, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <InputContainerStyled className={className}>
            {type === "textarea" ? (
                <TextAreaWrapper
                    name={name}
                    ref={ref}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    {...props} // Pasar todos los props al campo de entrada
                    style={{ width: "100%", height: "100px", resize: "vertical" }} // Agrega estilo si lo necesitas
                />
            ) : (
                <InputWrapper
                    name={name}
                    ref={ref}
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    step={step}
                    {...props} // Pasar todos los props al campo de entrada
                />
            )}

            {icon && <div className='icon-container'>{icon}</div>}
            {type === 'password' && (
                <div className='hi-eye' onMouseDown={togglePasswordVisibility} role="button" aria-label="Toggle Password Visibility">
                    {showPassword ? <AiOutlineEye /> : <AiFillEyeInvisible className='eye-off' />}
                </div>
            )}
            {isError && <span className='error-message'>{errorMessage}</span>}
        </InputContainerStyled>
    );
});

export default Input;
