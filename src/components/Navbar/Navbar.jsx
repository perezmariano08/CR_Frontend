import React, { useState } from 'react'
import { ContainerNoti, NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import Notifications from './Notifications/Notifications';

import { useDispatch } from 'react-redux';
import { toggleHiddenNotis } from '../../redux/Notis/notisSlice';
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
    const dispatch = useDispatch()
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
                        <li><NavLink to={'/'}>Mi equipo</NavLink></li>
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
