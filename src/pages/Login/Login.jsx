import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LoaderIcon, Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { URL } from '../../utils/utils';
import Input from '../../components/UI/Input/Input';
import { AiOutlineLock } from "react-icons/ai";
import { PiIdentificationCardLight } from 'react-icons/pi';
import { LoginContainerStyled, LoginWrapperUp, LoginDataContainer, LoginDataWrapper, LoginDataInputs, LoginDataPassword, ButtonLogin, LoginWrapperInfo, LoginWrapperForm, ActivInfoContainer } from "./LoginStyles";
import IsotipoCR from "/Logos/CR-Logo.png";
import { useDispatch } from 'react-redux';
import { setLogCurrentUser } from '../../redux/user/userSlice';
import { FaAngleRight } from 'react-icons/fa6';

const Login = () => {
    axios.defaults.withCredentials = true;
    const location = useLocation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [dniUser, setDniUser] = useState('');
    const [passUser, setPassUser] = useState('');
    const [cuentaActivada, setCuentaActivada] = useState(false);

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('activada') === 'true') {
            setCuentaActivada(true);
            
        }
    }, [location.search]);
    
    const handleLoginNext = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        try {
            const response = await axios.post(`${URL}/auth/check-login`, { dni: dniUser, password: passUser });
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                dispatch(setLogCurrentUser(true));
                window.location.href = '/';
            } else {
                toast.error('Error durante el inicio de sesión');
                setIsLoading(false);
            }
        } catch (error) {
            // Aquí manejamos el error capturado
            if (error.response && error.response.status === 401) {
                toast.error('Contraseña incorrecta');
            } else if (error.response && error.response.status === 403) {
                toast.error('Debes activar la cuenta');
            } else {
                toast.error('Error al iniciar sesión');
            }
            console.error("Error en la solicitud HTTP:", error);
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (isLoading) {
            setIsLoading(false);
        }
    }, []);

    return (
        <LoginContainerStyled>
            <LoginWrapperUp>
                <img src={IsotipoCR} />
            </LoginWrapperUp>
            <LoginWrapperInfo>
                <img src="./Logos/logoCopaRelampago.png" alt="Logo Copa Relampago" className='logo-cr' />
                <span>novedades</span>
                <h2>Seguimos innovando en CR para mejorar tus días!</h2>
            </LoginWrapperInfo>
            <LoginWrapperForm>
                <img src="./Logos/CR-Logo.png" alt="Logo Copa Relampago" className='logo-cr' />
                <LoginDataContainer>
                    <LoginDataWrapper>
                        <h1>¡Bienvenido! 👋</h1>
                        {cuentaActivada && (
                            <ActivInfoContainer className="alert alert-success">
                                <p><strong>✅ ¡Tu cuenta ha sido activada exitosamente!</strong>. Ahora puedes iniciar sesión.</p>
                            </ActivInfoContainer>
                        )}
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
                            <NavLink to={'/forgot-password'}>¿Olvidaste tu contraseña?</NavLink>
                        </LoginDataPassword>
                    </LoginDataWrapper>
                    <ButtonLogin 
                        disabled={!areInputsFilled()}
                        onClick={handleLoginNext}
                        type="submit"
                    >
                        
                        {isLoading ? (
                            <>
                                Ingresando
                                <LoaderIcon />
                            </>
                        ) : (
                            <>
                                Iniciar sesión
                                <FaAngleRight />
                            </>
                        )}
                    </ButtonLogin>
                    <p>¿No tienes cuenta? <NavLink to={'/create-account'}>Registrate</NavLink></p>
                </LoginDataContainer>
                <Toaster/>
            </LoginWrapperForm>
        </LoginContainerStyled>
    );
}

export default Login;
