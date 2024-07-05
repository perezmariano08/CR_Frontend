import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { URL } from '../../utils/utils';
import Input from '../../components/UI/Input/Input';
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { PiIdentificationCardLight } from 'react-icons/pi';
import { LoginContainerStyled, LoginWrapperUp, LoginWrapperDown, LoginDataContainer, LoginDataWrapper, LoginDataInputs, LoginDataPassword, ButtonLogin } from "./LoginStyles";
import IsotipoCR from "/Logos/CR-Logo.png";
import { useDispatch } from 'react-redux';
import { setLogCurrentUser } from '../../redux/user/userSlice';

const Login = () => {
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();

    const [dniUser, setDniUser] = useState('');
    const [passUser, setPassUser] = useState('');

    const handleDniChange = (event) => {
        const newDni = event.target.value;
        setDniUser(newDni);
    }

    const handlePassChange = (event) => {
        const newPass = event.target.value;
        setPassUser(newPass);
    }

    const areInputsFilled = () => {
        return dniUser.trim() !== '' && passUser.trim() !== '';
    }

    const handleLoginNext = async () => {
        try {
            const response = await axios.post(`${URL}/auth/check-login`, { dni: dniUser, password: passUser });
            if (response.status === 200) {
                dispatch(setLogCurrentUser(true))
                window.location.href = '/';
            } else {
                toast.error('Error durante el inicio de sesión');
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            toast.error('Error al iniciar sesión');
        }
    }

    return (
        <LoginContainerStyled>
            <LoginWrapperUp>
                <img src={IsotipoCR} />
            </LoginWrapperUp>
            <LoginWrapperDown>
                <LoginDataContainer>
                    <LoginDataWrapper>
                        <h1>¡Bienvenido!</h1>
                        <LoginDataInputs>
                            <Input 
                                icon={<PiIdentificationCardLight className='icon-input error'/>} 
                                placeholder='DNI' 
                                name={'dni'} 
                                id={'dni'} 
                                inputMode={'numeric'}
                                onChange={handleDniChange}
                                value={dniUser}
                            />
                            <Input 
                                type='password' 
                                placeholder='Contraseña' 
                                name={'contraseña'} 
                                id={'contraseña'} 
                                icon={<AiOutlineLock className='icon-input'/>}
                                onChange={handlePassChange}
                                value={passUser}
                            />
                        </LoginDataInputs>
                        <LoginDataPassword>
                            <NavLink>¿Olvidaste tu contraseña?</NavLink>
                        </LoginDataPassword>
                    </LoginDataWrapper>
                    <ButtonLogin 
                        disabled={!areInputsFilled()}
                        onClick={handleLoginNext}
                    >
                        Iniciar sesión
                    </ButtonLogin>
                    <p>¿No tienes cuenta? <NavLink to={'/create-account'}>Registrate</NavLink></p>
                </LoginDataContainer> 
            </LoginWrapperDown>
            <Toaster/>
        </LoginContainerStyled>
    );
}

export default Login;
