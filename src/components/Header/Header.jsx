import React from 'react'
import { HeaderContainerStyled, HeaderMenuBars, HeaderUser, HeaderWrapper } from './HeaderStyles'
import { HiOutlineBars3 } from "react-icons/hi2";
import Divider from '../Divider/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAside } from '../../redux/Aside/asideSlice';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';
import { IoIosLogOut } from "react-icons/io";
import { URL } from '../../utils/utils';
import { setLogCurrentUser } from '../../redux/user/userSlice';

const Header = () => {
  const dispatch = useDispatch(); // Obtener el dispatcher
  const usuarios = useSelector((state) => state.usuarios.data)
  const {userName, showWelcomeToast, setShowWelcomeToast, userId} = useAuth()

  const imgUsuarios = (idUsuario) => {
    const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario)
    return usuario ? usuario.img : null;
};

//Cerrar Sesion 
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
    <>
      <HeaderContainerStyled>
        <HeaderWrapper>
          <HeaderMenuBars onClick={() => dispatch(toggleAside())}>
            <HiOutlineBars3  /> 
          </HeaderMenuBars>
          <HeaderUser>
              <img src={`${URL}${imgUsuarios(userId)}`} />
              <p>¡Bienvenido/a, {userName}!</p>
              <IoIosLogOut onClick={closeSesion}/>
          </HeaderUser>
        </HeaderWrapper>
      </HeaderContainerStyled>
    </>
  )
}

export default Header
