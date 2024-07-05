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
            const response = await axios.post(`${URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.status === 401) {
                console.error('Error al cerrar sesión: No autorizado');
            } else if (response.status !== 200) {
                console.error('Error al cerrar sesión: ', response.statusText);
            } else {
                console.log('Sesión cerrada exitosamente');
                dispatch(setLogCurrentUser())
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error al cerrar sesión aca:', error);
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