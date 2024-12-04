import React, { useEffect, useState, useMemo } from 'react'
import { NavbarContainerStyled, NavbarList, NavbarLogo, NavbarWrapper, SelectTeamContainer, TeamContainer } from './NavbarStyles'
import logoCR from "/Logos/logoCopaRelampago.png"
import { IoShieldHalf } from "react-icons/io5";
import Notifications from './Notifications/Notifications';
import ModalSettingsUser from '../Modals/ModalSettingsUser/ModalSettingsUser';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import Select from '../Select/Select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEquipos } from '../../redux/ServicesApi/equiposSlice';
import { useEquipos } from '../../hooks/useEquipos';
import { URL, URLImages } from '../../utils/utils';
import { setNuevoEquipoSeleccionado } from '../../redux/user/userSlice';
import { fetchTemporadas } from '../../redux/ServicesApi/temporadasSlice';

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { escudosEquipos } = useEquipos();
    const equiposList = useSelector((state) => state.equipos.data)
    const temporadas = useSelector((state) => state.temporadas.data)
    // const equiposFiltrados = equiposList.filter(equipo => equipo.id_categoria !== null);
    const teamSelected = useSelector((state) => state.newUser.equipoSeleccionado)
    const [isOpenModalSettings, setModalSettings] = useState(false)
    // const [teamSelected, setTeamSelected] = useState(1);

    // Filtrar equipos vigentes usando useMemo para mejorar rendimiento
    const equiposFiltrados = useMemo(() => {
        const equiposVigentesIds = new Set(temporadas.map((temporada) => temporada.id_equipo));
        return equiposList.filter((equipo) => equiposVigentesIds.has(equipo.id_equipo));
    }, [equiposList, temporadas]);

    const toggleModalSettings = () => {
        setModalSettings(!isOpenModalSettings)
    }

    const openLogin = () => {
        navigate('/login')
    }

    const handleSetTeamSelected = (e) => {
        // setTeamSelected(parseInt(e.target.value));
        dispatch(setNuevoEquipoSeleccionado(parseInt(e.target.value)))
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
                        <li><NavLink to={'/my-team'}>Mi Equipo</NavLink></li>
                        <TeamContainer>
                            <img src={`${URLImages}/${escudosEquipos(teamSelected)}`} alt="" />
                            <Select
                                onChange={handleSetTeamSelected}
                                data={equiposFiltrados}
                                id_="id_equipo"
                                placeholder='Seleccionar equipo'
                                icon={<IoShieldHalf className='icon-select' />}
                                value={teamSelected}
                            />
                        </TeamContainer>
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
