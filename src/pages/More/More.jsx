import React from 'react'
import { ButtonLogout, MoreAction, MoreContainerImg, MoreIconContainer, MoreMid, MoreStyledContainer, MoreTop, MoreWrapper } from './MoreStyles'
import { HiMiniUser, HiDocumentMinus, HiFolderMinus, HiPhone  } from "react-icons/hi2";
import { CiLogout } from "react-icons/ci";
import axios from 'axios';
import { URL } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import { setLogCurrentUser } from '../../redux/user/userSlice';

const More = () => {
    const dispatch = useDispatch()
    axios.defaults.withCredentials = true;

    const closeSesion = async () => {
        try {
            // Realiza la solicitud de cierre de sesión al servidor
            const response = await axios.post(`${URL}/auth/logout`);
            
            if (response.status === 200) {
                // Si la respuesta es exitosa, elimina el token del almacenamiento local
                localStorage.removeItem('token');
                // Limpia los encabezados de autorización de axios
                axios.defaults.headers.common['Authorization'] = null;
                // Actualiza el estado de autenticación y redirige al usuario a la página de inicio de sesión
                dispatch(setLogCurrentUser(false));
                window.location.href = '/login';
            } else {
                // Maneja errores que no sean de autorización (401)
                console.error('Error al cerrar sesión: ', response.statusText);
            }
        } catch (error) {
            // Maneja cualquier otro error que pueda ocurrir durante la solicitud
            console.error('Error al cerrar sesión:', error);
        }
    };
    
    return (
    <MoreStyledContainer>
        <MoreWrapper>
            <MoreTop>
                <h2>Más</h2>
                <MoreContainerImg>
                    <img src="/public/imagen_log.png" alt="" />
                </MoreContainerImg>
            </MoreTop>
            <MoreMid>
                <MoreAction>
                    <MoreIconContainer>
                        <HiMiniUser />
                    </MoreIconContainer>
                    <h4>Mi perfil</h4>
                </MoreAction>
                <MoreAction>
                    <MoreIconContainer>
                        <HiDocumentMinus />
                    </MoreIconContainer>
                    <h4>Reglamento</h4>
                </MoreAction>
                <MoreAction>
                    <MoreIconContainer>
                        <HiFolderMinus />
                    </MoreIconContainer>
                    <h4>Archivo histórico</h4>
                </MoreAction>
                <MoreAction>
                    <MoreIconContainer>
                        <HiPhone/>
                    </MoreIconContainer>
                    <h4>Contacto</h4>
                </MoreAction>
                <ButtonLogout
                onClick={closeSesion}>
                    <CiLogout/>
                    Cerrar sesión
                </ButtonLogout>
            </MoreMid>

        </MoreWrapper>
    </MoreStyledContainer>
  )
}

export default More