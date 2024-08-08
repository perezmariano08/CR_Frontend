import React from 'react'
import { HeaderContainerStyled, HeaderMenuBars, HeaderUser, HeaderWrapper } from './HeaderStyles'
import { HiOutlineBars3 } from "react-icons/hi2";
import Divider from '../Divider/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAside } from '../../redux/Aside/asideSlice';
import { useAuth } from '../../Auth/AuthContext';
import axios from 'axios';
import { IoIosLogOut } from "react-icons/io";
import { URL, URLImages } from '../../utils/utils';
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
      // Realiza la solicitud de cierre de sesión al servidor
      const response = await axios.post(`${URL}/auth/logout`, null, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
      
      if (response.status === 200) {
          // Si la respuesta es exitosa, elimina el token del almacenamiento local
          localStorage.removeItem('token');
          // Limpia los encabezados de autorización de axios
          delete axios.defaults.headers.common['Authorization'];
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
    <>
      <HeaderContainerStyled>
        <HeaderWrapper>
          <HeaderMenuBars onClick={() => dispatch(toggleAside())}>
            <HiOutlineBars3  /> 
          </HeaderMenuBars>
          <HeaderUser>
              <img src={`${URLImages}${imgUsuarios(userId)}`} />
              <p>¡Bienvenido/a, {userName}!</p>
              <IoIosLogOut onClick={closeSesion}/>
          </HeaderUser>
        </HeaderWrapper>
      </HeaderContainerStyled>
    </>
  )
}

export default Header
