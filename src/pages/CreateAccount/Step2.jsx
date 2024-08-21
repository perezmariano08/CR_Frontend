import React, { useEffect, useState } from 'react';
import {
    CreateAccountContainerStyled,
    CreateAccountData,
    CreateAccountInputs,
    CreateAccountWrapper,
    InputContainer,
} from './CreateAccountStyles';
import Input from '../../components/UI/Input/Input';
import { AiOutlineLock } from 'react-icons/ai';
import { ButtonSubmit } from '../../components/UI/Button/ButtonStyles';
import { useDispatch } from 'react-redux';
import { setNewUserPassword } from '../../redux/user/userSlice';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { URL } from '../../utils/utils';
import axios from 'axios';
import { ButtonLogin, LoginWrapperInfo } from '../Login/LoginStyles';

const Step2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [repeatPasswordError, setRepeatPasswordError] = useState('');
    const [redirecting, setRedirecting] = useState(false); // Estado de redirección

    // Recovery
    const [recoveryPassword, setRecoveryPassword] = useState(false);
    const [token, setToken] = useState('');

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPasswordError('');

        if (newPassword.trim().length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        } else if (newPassword.trim().split('').filter(char => !isNaN(parseInt(char))).length < 3) {
            setPasswordError('La contraseña debe contener al menos tres números.');
        } else if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('La contraseña debe contener al menos una mayúscula.');
        }

        setPassword(newPassword);
    };

    const handleRepeatPasswordChange = (event) => {
        const newRepeatPassword = event.target.value;
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordError('');

        if (password !== newRepeatPassword) {
            setRepeatPasswordError('Las contraseñas no coinciden.');
        }
    };

    // RECOVERY PASSWORD
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            setRecoveryPassword(true);
            setToken(token);
        }
    }, [location.search]);

    const sendNewPassword = async (clave) => {
        setRedirecting(true); // Activa el estado de redirección
        try {
            const response = await axios.post(`${URL}/auth/change-password`, { clave, token });
            if (response.status === 200) {
                toast.promise(
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            navigate('/login');
                        }, 3000);
                    }),
                    {
                        loading: 'Actualizando contraseña...',
                        success: 'Contraseña actualizada exitosamente, redirigiendo al login',
                        error: 'Error al procesar la solicitud',
                    }
                );
                return true;
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('Usuario no encontrado');
                } else {
                    toast.error(`Error: ${error.response.data.message || 'Error al procesar la solicitud'}`);
                }
                console.error("Error en la solicitud HTTP:", error.response.data || error.message);
            } else {
                toast.error('Error en la solicitud');
                console.error("Error en la solicitud HTTP:", error.message);
            }
            return false;
        } finally {
            setRedirecting(false); // Desactiva el estado de redirección si hay error
        }
    };
    

    const handleNextStep3 = () => {
        if (passwordError || repeatPasswordError || password === '') {
            toast.error('Corrobore su contraseña');
            return;
        }

        if (password === repeatPassword && password !== '') {
            const convertPassword = password.trim();
            if (!recoveryPassword) {
                dispatch(setNewUserPassword(convertPassword));
                setRedirecting(true); // Activa el estado de redirección
                setTimeout(() => {
                    window.location.href = '/favorite-team';
                }, 2000);
            } else {
                if (token && convertPassword) {
                    sendNewPassword(convertPassword);
                }
            }
            setPassword('');
            setRepeatPassword('');
        }
    };

    return (
        <CreateAccountContainerStyled>
            <LoginWrapperInfo>
                <img src="./Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" className='logo-cr' />
                <span>novedades</span>
                <h2>Seguimos innovando en CR para mejorar tus días!</h2>
            </LoginWrapperInfo>
            <CreateAccountWrapper>
                <CreateAccountData>
                    {recoveryPassword ? (
                        <h2>Actualiza tu contraseña</h2>
                    ) : (
                        <h2>Crea tu contraseña</h2>
                    )}
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
                    <ButtonLogin
                        onClick={handleNextStep3}
                        disabled={redirecting} // Desactiva el botón durante la redirección
                    >
                        {redirecting ? <LoaderIcon /> : 'Continuar'}
                    </ButtonLogin>
                </CreateAccountData>
            </CreateAccountWrapper>
            <Toaster />
        </CreateAccountContainerStyled>
    );
};

export default Step2;
