import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoShieldHalf } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import { LiaFutbol } from "react-icons/lia";
import { TbCalendarEvent } from "react-icons/tb";
import { PiUsers } from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { AsideContainerStyled, AsideHeader, AsideMenu, AsideUser, MenuItem, NavLinkAngleDown, NavLinkItem, SubMenu, SubMenuItem } from './AsideStyles';
import Divider from '../Divider/Divider';
import LogoCR from '../../assets/Logos/logoCopaRelampago.png'
import UserImg from '../../assets/user-default.png'
import { useLocation } from 'react-router-dom';
import { TbShirtSport } from "react-icons/tb";
import { useAuth } from '../../Auth/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { setLogCurrentUser } from '../../redux/user/userSlice';
import axios from 'axios';
import { URL } from '../../utils/utils';
import toast, { Toaster } from 'react-hot-toast';
import { fetchUsuarios } from '../../redux/ServicesApi/usuariosSlice';


const Aside = ({className}) => {
    const dispatch = useDispatch()
    const location = useLocation();
    
    const [showSubMenu, setShowSubMenu] = useState(false);
    const isActiveTemporadas = location.pathname.includes("/admin/temporadas");

    const usuarios = useSelector((state) => state.usuarios.data)
    

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
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

    const imgUsuarios = (idUsuario) => {
        const usuario = usuarios.find((usuario) => usuario.id_usuario === idUsuario)
        return usuario ? usuario.img : null;
    };


    //Mensaje bienvenida
    const {userName, showWelcomeToast, setShowWelcomeToast, userId} = useAuth()
    useEffect(() => {
        dispatch(fetchUsuarios())
        if (userName && showWelcomeToast) {
            toast(`Bienvenid@, administrador ${userName}`, {
                icon: '👋',
                style: {
                    borderRadius: '10px',
                    background: 'var(--gray-500)',
                    color: 'var(--white)',
                },
                duration: 4000,
                position: "top-center"
            });
            setShowWelcomeToast(false);
        }
        setShowSubMenu(isActiveTemporadas);
    }, [userName, showWelcomeToast, setShowWelcomeToast, isActiveTemporadas]);
    
    return (
        <>
        <AsideContainerStyled className={className}>
            <AsideHeader>
                <img src={LogoCR} alt="" />
            </AsideHeader>
            <Divider color="gray-300" />
            <AsideUser>
                <img src={`/Usuarios/${imgUsuarios(userId)}`} />
                <p>{userName}</p>
                <IoIosLogOut onClick={closeSesion}/>
            </AsideUser>
            <Divider color="gray-300" />
            <AsideMenu>
                <NavLinkItem to={"/admin/dashboard"}>
                    <MdOutlineDashboard />
                    <p>Dashboard</p>
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
                        <NavLinkItem onClick={toggleSubMenu} className="custom-navlink">
                            <PiUsers />
                            <p>Temporadas</p>
                            <NavLinkAngleDown
                                animate={{ rotate: showSubMenu ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ marginLeft: 'auto' }}
                            >
                                <FaAngleDown className='angle-down' />
                            </NavLinkAngleDown>
                        </NavLinkItem>
                    </motion.div>
                    <AnimatePresence>
                        {showSubMenu && (
                            <motion.div
                                initial={{ opacity: 0, maxHeight: 0}}
                                animate={{ opacity: 1, maxHeight: 1000}}
                                exit={{ opacity: 0, maxHeight: 0 }}
                                transition={{ duration: 0.45 }}
                                style={{ overflow: "hidden" }}
                                className='submenu'
                            >
                                <SubMenu>
                                    <SubMenuItem to={"/admin/temporadas/temporada"} isActive={isActiveTemporadas} >Crear temporada</SubMenuItem>
                                    <SubMenuItem to={"/admin/temporadas/categorias"} isActive={isActiveTemporadas}>Categorías</SubMenuItem>
                                    <SubMenuItem to={"/admin/temporadas/torneos"} isActive={isActiveTemporadas}>Torneos</SubMenuItem>
                                    <SubMenuItem to={"/admin/temporadas/sedes"} isActive={isActiveTemporadas}>Sedes</SubMenuItem>
                                    <SubMenuItem to={"/admin/temporadas/años"} isActive={isActiveTemporadas}>Años</SubMenuItem>
                                    <SubMenuItem to={"/admin/temporadas/divisiones"} isActive={isActiveTemporadas}>Divisiones</SubMenuItem>
                                </SubMenu>
                            </motion.div> 
                        )}
                    </AnimatePresence>
                </MenuItem>
            </AsideMenu>
        </AsideContainerStyled>
        <Toaster/>
        </>
    );
};

export default Aside;
