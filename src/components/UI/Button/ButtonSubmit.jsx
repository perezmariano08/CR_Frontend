import React from 'react'
import { ButtonWrapper } from './ButtonStyles'

const ButtonSubmit = ({children, onSubmit}) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit()
    }

    return (
        <ButtonWrapper type='submit' onClick={handleSubmit}>
            {children}
        </ButtonWrapper>
    )
}

export default ButtonSubmit