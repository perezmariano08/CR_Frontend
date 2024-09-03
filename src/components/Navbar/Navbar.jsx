import React, { useState } from 'react'
import { NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import { IoMdSettings } from "react-icons/io";
import Notifications from './Notifications/Notifications';
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';

export const Navbar = () => {
    const [isOpenModalSettings, setModalSettings] = useState(false)

    const toggleModalSettings = () => {
        setModalSettings(!isOpenModalSettings)
    }
    return (
        <>
            <NavbarContainerStyled>
                <NavbarWrapper>
                    <NavbarLogo to={'/'}>
                        <img src={logoCR} alt="Logo Copa Relampago" />
                    </NavbarLogo>
                    <NavbarList>
                        <li><NavLink to={'/'}>Inicio</NavLink></li>
                        <li><NavLink to={'/categorias'}>Categorias</NavLink></li>
                        <IoMdSettings onClick={() => toggleModalSettings()}/>
                    </NavbarList>
                    
                    {/* <ContainerNoti onClick={() => dispatch(toggleHiddenNotis())}>
                        <IoIosNotifications />
                    </ContainerNoti> */}
                    
                    {
                        isOpenModalSettings && (
                            <ModalSettingsUser closeModal={toggleModalSettings} />
                        )
                    }
                </NavbarWrapper>
                <Notifications/>
            </NavbarContainerStyled>
        </>
    )
}
