import React, { useState } from 'react';
import { CreateAccountContainerStyled, CreateAccountData, CreateAccountInputs, CreateAccountWrapper, InputContainer } from './CreateAccountStyles';
import Input from '../../components/UI/Input/Input';
import { AiOutlineLock } from 'react-icons/ai';
import { ButtonSubmit } from '../../components/UI/Button/ButtonStyles';
import { useDispatch } from 'react-redux';
import { setNewUser, setNewUserPassword } from '../../redux/user/userSlice';

const Step2 = () => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [repeatPasswordError, setRepeatPasswordError] = useState('');
    const dispatch = useDispatch();

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        setPasswordError('');

        if (newPassword.trim().length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        } else if (newPassword.trim().split('').filter(char => !isNaN(parseInt(char))).length < 3) {
            setPasswordError('La contraseña debe contener al menos tres números.');
        } else if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('La contraseña debe contener al menos una mayúscula.');
        }
    };

    const handleRepeatPasswordChange = (event) => {
        const newRepeatPassword = event.target.value;
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordError('');
        
        if (password !== newRepeatPassword) {
            setRepeatPasswordError('Las contraseñas no coinciden.');
        }
    };

    const handleNextStep3 = () => {
        if (passwordError || repeatPasswordError) {
            return;
        }
        if (password === repeatPassword) {
            dispatch(setNewUserPassword(password));
            setPassword('');
            setRepeatPassword('');
            window.location.href = '/favorite-team';
            return;
        }
    };

    return (
        <CreateAccountContainerStyled>
            <CreateAccountWrapper>
                <CreateAccountData>
                    <h2>Crea tu contraseña</h2>
                    <CreateAccountInputs>
                        <InputContainer>
                            <Input
                                value={password}
                                onChange={handlePasswordChange}
                                type='password'
                                placeholder='Contraseña'
                                name='password'
                                id='password'
                                icon={<AiOutlineLock className='icon-input' />}
                            />
                                {passwordError && <p>{passwordError}</p>}
                        </InputContainer>

                        <InputContainer>
                            <Input
                                value={repeatPassword}
                                onChange={handleRepeatPasswordChange}
                                type='password'
                                placeholder='Confirmar contraseña'
                                name='confirm-password'
                                id='confirm-password'
                                icon={<AiOutlineLock className='icon-input' />}
                            />
                                {repeatPasswordError && <p>{repeatPasswordError}</p>}
                        </InputContainer>

                    </CreateAccountInputs>
                    <ButtonSubmit
                    onClick={handleNextStep3}>
                        Continuar
                    </ButtonSubmit>
                </CreateAccountData>
            </CreateAccountWrapper>
        </CreateAccountContainerStyled>
    );
};

export default Step2;
