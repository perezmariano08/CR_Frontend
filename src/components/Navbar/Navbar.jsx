import React from 'react'
import { ContainerNoti, NavbarContainerStyled, NavbarWrapper } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import { IoIosNotifications } from "react-icons/io";
import Notifications from './Notifications/Notifications';

import { useDispatch } from 'react-redux';
import { toggleHiddenNotis } from '../../redux/Notis/notisSlice';

export const Navbar = () => {
    const dispatch = useDispatch()

    return (
        <NavbarContainerStyled>
            <NavbarWrapper>
                <img src={logoCR} alt="Logo Copa Relampago" />
                <ContainerNoti onClick={() => dispatch(toggleHiddenNotis())}>
                    <IoIosNotifications />
                </ContainerNoti>
            </NavbarWrapper>
            <Notifications/>
        </NavbarContainerStyled>
    )
}
