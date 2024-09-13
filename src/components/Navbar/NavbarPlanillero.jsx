import React, { useState } from 'react'
import { NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import { IoMdSettings } from "react-icons/io";
import Notifications from './Notifications/Notifications';
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';
import { NavLink, useNavigate } from 'react-router-dom';

export const NavbarPlanillero = () => {
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
