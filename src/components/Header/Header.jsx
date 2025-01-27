import React, { useState } from 'react'
import { HeaderContainerStyled, HeaderMenuBars, HeaderUser, HeaderWrapper } from './HeaderStyles'
import { HiOutlineBars3 } from "react-icons/hi2";
import { useDispatch, useSelector } from 'react-redux';
import { toggleAside } from '../../redux/Aside/asideSlice';
import { useAuth } from '../../Auth/AuthContext';
import { URLImages } from '../../utils/utils';
import { IoMdSettings } from "react-icons/io";
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';

const Header = () => {
  const dispatch = useDispatch(); // Obtener el dispatcher
  const usuarios = useSelector((state) => state.usuarios.data)
  const {userName, userId} = useAuth()

  const imgUsuarios = (idUsuario) => {
    const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario)
    return usuario ? usuario.img : null;
};

const [modalSettings, setModalSettings] = useState(false)

const toggleModalSettings = () => {
    setModalSettings(!modalSettings)
}

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
              {/* <IoIosLogOut onClick={closeSesion}/> */}
              <IoMdSettings onClick={() => toggleModalSettings()}/>
          </HeaderUser>
          {
              modalSettings && (
                  <ModalSettingsUser closeModal={toggleModalSettings} />
              )
          }
        </HeaderWrapper>
      </HeaderContainerStyled>
    </>
  )
}

export default Header
