import { OnboardingButtonsWrapper, OnboardingContainerStyled, OnboardingWrapper } from './OnboardingStyles'
import Button from '../../components/UI/Button/Button'
import IsotipoCR from "/Logos/CR-Logo.png"
import React from 'react';

const Onboarding = () => {
    return (
        <OnboardingContainerStyled>
            <OnboardingWrapper>
                <img src={IsotipoCR} alt="Logo Copa Relampago" />
                <OnboardingButtonsWrapper>
                    <Button to='/login'>Iniciar Sesion</Button>
                    <Button to='/create-account' border='white' background='transparent' color='white'>Crear Cuenta</Button>
                </OnboardingButtonsWrapper> 
            </OnboardingWrapper>
        </OnboardingContainerStyled> 
    )
}

export default Onboarding