import React, { useEffect, useState } from 'react'
import { NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import Notifications from './Notifications/Notifications';
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice';

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpenModalSettings, setModalSettings] = useState(false)
    const toggleModalSettings = () => {
        setModalSettings(!isOpenModalSettings)
    }
    const openLogin = () => {
        navigate('/login')
    }

    useEffect(() => {
        dispatch(fetchEquipos());
        dispatch(fetchTemporadas());
    }, [dispatch]);
    
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
                        {/* <li><NavLink to={'/my-team'}>Mi Equipo</NavLink></li> */}
                        <FaUserCircle onClick={openLogin}/>
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
