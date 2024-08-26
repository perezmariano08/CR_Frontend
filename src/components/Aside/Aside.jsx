import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoShieldHalf } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { LiaFutbol } from "react-icons/lia";
import { TbCalendarEvent } from "react-icons/tb";
import { PiUsers } from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import { AsideContainerStyled, AsideHeader, AsideMenu, AsideMenuWrapper, MenuItem, NavLinkAngleDown, NavLinkItem, SubMenu, SubMenuItem } from './AsideStyles';
import Divider from '../Divider/Divider';
import LogoCR from '../../assets/Logos/logoCopaRelampago.png'
import { useLocation } from 'react-router-dom';
import { TbShirtSport } from "react-icons/tb";
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { fetchUsuarios } from '../../redux/ServicesApi/usuariosSlice';
import { fetchJugadores } from '../../redux/ServicesApi/jugadoresSlice';
import { BiBlock } from "react-icons/bi";
import { HiOutlineTrophy } from "react-icons/hi2";


const Aside = ({className}) => {
    const dispatch = useDispatch()
    const location = useLocation();
    
    const [showSubMenuTemporadas, setShowSubMenuTemporadas] = useState(false);
    const [showSubMenuSanciones, setShowSubMenuSanciones] = useState(false);
    const isActiveTemporadas = location.pathname.includes("/admin/temporadas");
    const isActiveSanciones = location.pathname.includes("/admin/sanciones");

    const usuarios = useSelector((state) => state.usuarios.data)
    


    const toggleSubMenuTemporadas = () => {
        setShowSubMenuTemporadas(!showSubMenuTemporadas);
    };

    const toggleSubMenuSanciones = () => {
        setShowSubMenuSanciones(!showSubMenuSanciones);
    };


    //Mensaje bienvenida
    const {userName, showWelcomeToast, setShowWelcomeToast, userId} = useAuth()
    useEffect(() => {
        dispatch(fetchUsuarios())
        dispatch(fetchJugadores())
        setShowSubMenuTemporadas(isActiveTemporadas);
        setShowSubMenuSanciones(isActiveSanciones);
    }, [userName, showWelcomeToast, setShowWelcomeToast, isActiveTemporadas]);

    const isOpen = useSelector((state) => state.aside.isOpen);
    
    return (
        <>
            <AsideContainerStyled 
                className={className}
                initial={{ x: '0%' }}
                animate={{ x: isOpen ? 0 : '-100%' }}
                transition={{ duration: 0.3 }}
            >
                <AsideHeader>
                    <img src={LogoCR} alt="" />
                </AsideHeader>    
                <Divider color="gray-300" />
                <AsideMenuWrapper>
                    <AsideMenu>
                        <NavLinkItem to={"/admin/dashboard"}>
                            <MdOutlineDashboard />
                            <p>Dashboard</p>
                        </NavLinkItem>
                        <NavLinkItem to={"/admin/ediciones"}>
                            <HiOutlineTrophy />
                            <p>Ediciones</p>
                        </NavLinkItem>
                        <NavLinkItem to={"/admin/equipos"}>
                            <IoShieldHalf />
                            <p>Equipos</p>
                        </NavLinkItem>
                        <NavLinkItem to={"/admin/usuarios"}>
                            <LiaFutbol />
                            <p>Usuarios</p>
                        </NavLinkItem>
                        <NavLinkItem to={"/admin/jugadores"}>
                            <TbShirtSport />
                            <p>Jugadores</p>
                        </NavLinkItem>
                        <NavLinkItem to={"/admin/partidos"}>
                            <TbCalendarEvent />
                            <p>Partidos</p>
                        </NavLinkItem>
                        <MenuItem>
                            <motion.div style={{ display: 'flex', alignItems: 'center' }}>
                                <NavLinkItem onClick={toggleSubMenuSanciones} className="custom-navlink">
                                    <BiBlock />
                                    <p>Sanciones</p>
                                    <NavLinkAngleDown
                                        animate={{ rotate: showSubMenuSanciones ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ marginLeft: 'auto' }}
                                    >
                                        <FaAngleDown className='angle-down' />
                                    </NavLinkAngleDown>
                                </NavLinkItem>
                            </motion.div>
                            <AnimatePresence>
                                {showSubMenuSanciones && (
                                    <motion.div
                                        initial={{ opacity: 0, maxHeight: 0}}
                                        animate={{ opacity: 1, maxHeight: 1000}}
                                        exit={{ opacity: 0, maxHeight: 0 }}
                                        transition={{ duration: 0.45 }}
                                        style={{ overflow: "hidden" }}
                                        className='submenu'
                                    >
                                        <SubMenu>
                                            <SubMenuItem to={"/admin/sanciones/expulsados"}>Expulsados</SubMenuItem>
                                            <SubMenuItem to={"/admin/sanciones/amonestados"}>Amonestados</SubMenuItem>
                                        </SubMenu>
                                    </motion.div> 
                                )}
                            </AnimatePresence>
                        </MenuItem>
                    </AsideMenu>
                </AsideMenuWrapper>
            </AsideContainerStyled>
        </>
    );
};

export default Aside;
